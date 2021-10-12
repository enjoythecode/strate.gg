from flask import Flask, render_template, request
import flask_socketio as sckt
from py_logic.user import User
from py_logic.challenge import Challenge, ChallengeStatus
import random, os, string, json
 
# Returns a random string of the required size.
def generate_ID(size, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

challenges = {}
users = {}

# create and configure the app
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY = 'dev',
    DEBUG = True
)
socketio = sckt.SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")

############ ROUTES ###############
@app.route('/')
def serve_index():
    return app.send_static_file('view/index.html')

@app.route('/play/<game>')
def serve_play(game):
    if game == "amazons":
        return app.send_static_file('view/play/amazons.html')
    else:
        return "False"

############# SOCKETS #############
### Generic
@socketio.on('message')
def handle_message(data):
    print('Received message:', data)

@socketio.on('connect')
def handle_connect():
    sid = request.sid
    users[sid] = User(sid)
    print(f'Client (#{sid}) connected. Currently connected: {len(users)}')
    socketio.emit("connection-info-update", {"users": len(users)}, broadcast = True)

    # this helps the client distinguish themselves among other users
    socketio.emit("connection-player-id", {"pid": sid}, to = sid) 

@socketio.on('disconnect')
def handle_disconnect():
    # Handle: notify any games they were in and change those accordingly!
    sid = request.sid
    user = users[sid]

    for cid in user.games_playing:
        handle_player_disconnect(cid, user)

    users.pop(sid)
    
    socketio.emit("connection-info-update", {"users": len(users)}, broadcast = True)
    print(f'Client (#{sid}) disconnected. Currently connected: {len(users)}')

### Game Events
@socketio.on('game-create')
def create_game(payload):

    cid = generate_ID(8)
    while cid in challenges:
        cid = generate_ID(8)
        
    c = Challenge()
    challenges[cid] = c
    response = c.initialize_challenge(payload["game_name"], cid, payload["config"])

    return response

@socketio.on('game-join')
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
        sckt.emit("game-update-meta", payload, to=challenges[cid].get_socket_room_name())
        sckt.join_room(c.get_socket_room_name())
        return payload
    else:
        return {"result": "error", "error": "Game not found."}

@socketio.on('game-move')
def handle_game_move(payload):
    cid = payload["cid"]
    sid = request.sid

    if cid and cid in challenges:
        c = challenges[cid]
        response = c.make_move(payload["move"], users[sid])
        sckt.emit("game-update-move", response, to=challenges[cid].get_socket_room_name())
    else:
        return {"result": "error", "error": "Game not found"}

@socketio.on('tv-poll')
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
    socketio.run(app, host='0.0.0.0', port='8080')