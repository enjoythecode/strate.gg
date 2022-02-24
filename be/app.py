import base64
import functools
import json
import os
import pathlib
import random
import string
import uuid

import flask_socketio as sckt
import redis
from flask import Flask
from flask import redirect
from flask import request
from flask import send_from_directory
from flask import session
from flask_session import Session

from py_logic.challenge import Challenge
from py_logic.challenge import ChallengeStatus


# in seconds, how much time after the last known action is a user taken
# to be online
USER_ONLINE_KEEPALIVE = 60

SESSION_KEYFOR_USERID = "uid"
SESSION_KEYFOR_GAMESPLAYING = "games_playing"


# Returns a random string of the required size.
def generate_ID(size, chars=string.ascii_uppercase + string.digits):
    return "".join(random.choice(chars) for x in range(size))


challenges = {}

# create and configure the app
app = Flask(__name__, instance_relative_config=False, static_folder="../fe/build")

config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path("config.json")
with open(config_location) as config_file:
    app.config.update(json.load(config_file))  # load secret key
r = redis.Redis(host="redis", port=6379, db=0)
app.config.update(
    SESSION_TYPE="redis",  # Flask-Session
    SESSION_REDIS=r,  # Flask-Session uses the existing redis connection object
)
Session(app)
socketio = sckt.SocketIO(
    app, async_mode="eventlet", cors_allowed_origins="*", manage_session=False
)


# ----------------------------   SERVE REACT   ---------------------------- #
@app.route("/", defaults={"path": ""})  #
# TODO switch this to /static/<path:path> (coordinate with FE)
@app.route("/<path:path>")
def serve(path):

    # in the development environment, the client files are served by the npm
    # development server which is on a different port. in production, they
    # are built by npm and served by flask within this method
    # to get the same session flow between dev and prod, we set the session
    # here at the base url for the Flask app *in debug mode only*
    # that means that you should go to localhost:8080 when testing the data
    # in your local environment.
    # note: sessions are handled server side in Redis, and that is why setting
    # the cookie once is enough. this is also how we get access to the Flask
    # session in Flask-SocketIO: socketio defers session management with the
    # manage_session = False setting on initialization.
    if app.debug:
        setup_server_side_session_cookie()
        return redirect("http://localhost:3000")

    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# ----------------------------       API       ---------------------------- #


@app.route("/api/user")
def setup_server_side_session_cookie():
    """

    dummy implementation that assigns all new users a new UID (= user ID) (since there
    is no matching account (there isn't an account system yet), this is equivalent to a
    new anon user!)

    does not replace existing UID such that repeat visitors are identified the same
    until the cookie expires or they clear it.

    """
    # decode a b64 encoded UUID to original (if ever needed) as follows:
    # uuid.UUID(bytes=base64.b64decode("WgNqblksTomwoelTRw0vaQ=="))

    if SESSION_KEYFOR_USERID in session:
        pass  # note: might need to record some index to redis (sid <-> uid)
    else:
        uid = base64.b64encode(uuid.uuid4().bytes).decode()
        session[SESSION_KEYFOR_USERID] = uid

    return "ok"


# ----------------------------   REDIS DEBUG   ---------------------------- #
if app.debug:

    @app.route("/r/ping")
    def rdb_ping():
        redis_alive = r.ping()
        return "alive" if redis_alive else "dead"

    @app.route("/r/set")
    def rdb_set():
        key = request.args.get("key")
        val = request.args.get("val")
        response = r.set(key, val)
        print(f"set {key} => {val}. got {response}")
        return "OK"

    @app.route("/r/get")
    def rdb_get():
        key = request.args.get("key")
        response = r.get(key)
        print(f"got {key}; {response}")
        return str(response)


# ---------------------------- ONLINE STATUS ---------------------------- #


def set_user_alive(uid):
    r.set("user:is_online:" + uid, 1, ex=USER_ONLINE_KEEPALIVE)


def means_user_is_alive(f):
    """
    A decorator on socket.io endpoints that updates our cache to indicate that
    this user is still online.
    """

    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        socketio.start_background_task(set_user_alive, session["uid"])
        return f(*args, **kwargs)

    return decorated_function


# ----------------------------     SOCKETS     ---------------------------- #
# ---- Generic
@socketio.on("message")
def handle_message(data):
    print("Received message:", data)


@socketio.on("connect")
@means_user_is_alive
def handle_connect(*args, **kwargs):
    sid = request.sid
    print("=" * 70)
    print("@socketion.on('connect')")
    print(request.cookies)
    print(socketio.manage_session)
    print(session)
    print("=" * 70)

    uid = session[SESSION_KEYFOR_USERID]

    # TODO look into the accuracy of this: this will count open pages, and not
    # individual users
    count_users = r.incr("system:online_users")

    # TODO pushing out the number of users should be handled by some other task
    # as number of users scale, this will consume a lot of cpu and bandwidth!
    print(f"Client (#{sid}) connected. Currently connected: {count_users}")
    socketio.emit("connection-info-update", {"users": count_users}, broadcast=True)

    # telling the client their UID so that it can distinguish itself from others in
    # game metadata
    socketio.emit("connection-player-id", {"uid": uid}, to=sid)


@socketio.on("disconnect")
def handle_disconnect():
    # Handle: notify any games they were in and change those accordingly!
    sid = request.sid
    uid = session[SESSION_KEYFOR_USERID]

    r.delete("user:is_online:" + uid)
    count_users = r.decr("system:online_users")

    for cid in session.get(SESSION_KEYFOR_GAMESPLAYING, []):
        handle_player_disconnect(cid, uid)

    socketio.emit("connection-info-update", {"users": count_users}, broadcast=True)
    print(f"Client (#{sid}) disconnected. Currently connected: {count_users}")


# ---- Game events
@socketio.on("game-create")
@means_user_is_alive
def create_game(payload):

    cid = generate_ID(8)
    while cid in challenges:
        cid = generate_ID(8)

    c = Challenge()
    challenges[cid] = c
    response = c.initialize_challenge(payload["game_name"], cid, payload["config"])

    return response


@socketio.on("game-join")
def game_join(payload):
    cid = payload["cid"]
    # sid = request.sid
    uid = session[SESSION_KEYFOR_USERID]

    if cid and cid in challenges:
        c = challenges[cid]
        response = c.join_player(uid)
        if response["result"] == "success":
            payload = {"result": "success", "info": response}
        else:
            return response
        # avoid sending twice by first emitting, and then sending the room
        sckt.emit(
            "game-update-meta", payload, to=challenges[cid].get_socket_room_name()
        )
        sckt.join_room(c.get_socket_room_name())
        return payload
    else:
        return {"result": "error", "error": "Game not found."}


@socketio.on("game-move")
@means_user_is_alive
def handle_game_move(payload):
    cid = payload["cid"]
    uid = session["uid"]

    if cid and cid in challenges:
        c = challenges[cid]
        response = c.make_move(payload["move"], uid)
        print(response)
        sckt.emit(
            "game-update-move", response, to=challenges[cid].get_socket_room_name()
        )
    else:
        return {"result": "error", "error": "Game not found"}


@socketio.on("tv-poll")
def available_tv_challenges(payload):
    for key in challenges:
        if challenges[key].status == ChallengeStatus.IN_PROGRESS:
            r = {"result": "success", "cid": challenges[key].cid}
            return r
    return {"result": "error", "error": "No games available!"}


def handle_player_disconnect(cid, uid):
    response = challenges[cid].handle_disconnect(uid)
    payload = {"result": "success", "info": response}
    sckt.emit("game-update-meta", payload, to=challenges[cid].get_socket_room_name())


if __name__ == "__main__":
    r.set("system:online_users", 0)  # default value of 0
    socketio.run(app, host="0.0.0.0", port="8080")
