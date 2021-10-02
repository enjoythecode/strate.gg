from flask import Flask, render_template, request
import flask_socketio as sckt
from ai.amazons_state import AmazonsState as amzn_state
import random, os, string, json
 
# Returns a random string of the requires size.
def generate_ID(size, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

games = {}
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
    return app.send_static_file('index.html')

@app.route('/play/<game>')
def serve_play(game):
    if game == "amazons":
        return app.send_static_file('play/amazons.html')
    else:
        return "False"

############# SOCKETS #############
@socketio.on('message')
def handle_message(data):
    print('Received message:', data)

@socketio.on('connect')
def handle_connect():
    users[request.sid] = True
    print(f'Client (#{request.sid}) connected. Currently connected: {len(users)}')

@socketio.on('disconnect')
def handle_disconnect():
    # Handle: notify any games they were in and change those accordingly!
    users.pop(request.sid)
    print(f'Client (#{request.sid}) disconnected. Currently connected: {len(users)}')

@socketio.on('game-create')
def create_game(payload):

    gid = generate_ID(8)
    while gid in games:
        gid = generate_ID(8)
    g = amzn_state.create_from_size(payload["size"], payload["config"])

    games[gid] = {
        "board": g,
        "players": [],
        "in_progress": False,
        "started": False
    }
    return {"result": "success", "gid": gid}

@socketio.on('game-join')
def get_game_data(payload):
    gid = payload["gid"]

    if gid and gid in games:
        g = games[gid]
        print(g)

        # Include player to game
        if len(g["players"]) < 2:
            sid = request.sid
            g["players"].append(sid)


        print("GAME PLAYERS:", g["players"])

        # Start game if full
        if len(g["players"]) == 2:
            g["started"] = True
            g["in_progress"] = True

        # Build Response
        response = g["board"].game_data()
        response["players"] = g["players"]
        response["in_progress"] = g["in_progress"]
        sckt.emit("game-update", response, to = "amazons_" + gid) # we want to emit these without emitting player specific data!

        # Client-specific info!
        response["client_is_player"] = request.sid in response["players"]
        response["client_side"] = 0 if not response["client_is_player"] else g["players"].index(request.sid) + 1
        sckt.join_room("amazons_" + gid)

        return {"result": "success", "info": response}
    else:
        return {"result": "error", "error": "Game not found."}

@socketio.on('game-move')
def handle_game_move(payload):
    gid = payload["gid"]
    sid = request.sid

    if gid and gid in games:
        g = games[gid]
        b = g["board"]
        if sid in g["players"] and b.playerJustMoved != g["players"].index(request.sid) + 1:
            move = [
                payload["move"]["from"],
                payload["move"]["to"],
                payload["move"]["shoot"]
            ]
            b.make_move(move)
        
            response = b.game_data()
            response["players"] = g["players"]
            response["in_progress"] = g["in_progress"]
            sckt.emit("game-update", response, to = "amazons_" + gid)
            print("--------", sckt.rooms(), "----------")
            return {"result": "success"}


if __name__ == "__main__":
    socketio.run(app)