import functools
import json
import os
import pathlib
import random
import string

import flask_socketio as sckt
import redis
from flask import Flask
from flask import request
from flask import send_from_directory

from py_logic.challenge import Challenge
from py_logic.challenge import ChallengeStatus
from py_logic.user import User

# import uuid

# in seconds, how much time after the last known action is a user taken
# to be online
USER_ONLINE_KEEPALIVE = 60


# Returns a random string of the required size.
def generate_ID(size, chars=string.ascii_uppercase + string.digits):
    return "".join(random.choice(chars) for x in range(size))


challenges = {}
users = {}

# create and configure the app
app = Flask(__name__, instance_relative_config=False, static_folder="../fe/build")
r = redis.Redis(host="redis", port=6379, db=0)
config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path("config.json")
with open(config_location) as config_file:
    app.config.update(json.load(config_file))  # load secret key

socketio = sckt.SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")


# ----------------------------   SERVE REACT   ---------------------------- #
@app.route("/", defaults={"path": ""})  #
@app.route("/<path:path>")  #
def serve(path):  #
    if path != "" and os.path.exists(app.static_folder + "/" + path):  #
        return send_from_directory(app.static_folder, path)  #
    else:  #
        return send_from_directory(app.static_folder, "index.html")  #


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


def set_user_alive(user_id):
    r.set("user:is_online:" + user_id, 1, ex=USER_ONLINE_KEEPALIVE)


def means_user_is_alive(f):
    """
    A decorator on socket.io endpoints that updates our cache to indicate that
    this user is still online.
    """

    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        sid = request.sid
        socketio.start_background_task(set_user_alive, sid)

        return f(*args, **kwargs)

    return decorated_function


# ----------------------------     SOCKETS     ---------------------------- #
# ---- Generic
@socketio.on("message")
def handle_message(data):
    print("Received message:", data)


@socketio.on("connect")
def handle_connect():
    sid = request.sid
    set_user_alive(sid)

    count_users = r.incr("system:online_users")
    users[sid] = User(sid)

    # TODO pushing out the number of users should be handled by a background task
    print(f"Client (#{sid}) connected. Currently connected: {count_users}")
    socketio.emit("connection-info-update", {"users": count_users}, broadcast=True)

    # this helps the client distinguish themselves among other users
    # TODO: this is to be replaced by UUIDs for users, including anons
    socketio.emit("connection-player-id", {"pid": sid}, to=sid)


@socketio.on("disconnect")
def handle_disconnect():
    # Handle: notify any games they were in and change those accordingly!
    sid = request.sid
    user = users[sid]
    r.delete("user:is_online:" + sid)
    count_users = r.decr("system:online_users")

    for cid in user.games_playing:
        handle_player_disconnect(cid, user)

    users.pop(sid)

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
    sid = request.sid
    user = users[sid]

    if cid and cid in challenges:
        c = challenges[cid]
        response = c.join_player(user)
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
    sid = request.sid

    if cid and cid in challenges:
        c = challenges[cid]
        response = c.make_move(payload["move"], users[sid])
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


def handle_player_disconnect(cid, user):
    response = challenges[cid].handle_disconnect(user)
    payload = {"result": "success", "info": response}
    sckt.emit("game-update-meta", payload, to=challenges[cid].get_socket_room_name())


if __name__ == "__main__":
    r.set("system:online_users", 0)  # default value of 0
    socketio.run(app, host="0.0.0.0", port="8080")
