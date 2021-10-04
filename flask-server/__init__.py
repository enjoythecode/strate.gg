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
### Generic
@socketio.on('message')
def handle_message(data):
    print('Received message:', data)

@socketio.on('connect')
def handle_connect():
    sid = request.sid
    users[sid] = {"sid": sid, "games_playing": [], "games_observing":  []}
    print(f'Client (#{sid}) connected. Currently connected: {len(users)}')
    socketio.emit("connection-info-update", {"users": len(users)}, broadcast = True)

@socketio.on('disconnect')
def handle_disconnect():
    # Handle: notify any games they were in and change those accordingly!
    sid = request.sid
    user = users[sid]
    games_played = user["games_playing"]
    games_observed = user["games_observing"]

    for gid in games_played:
        handle_player_disconnect(gid, sid)

    users.pop(request.sid)
    
    socketio.emit("connection-info-update", {"users": len(users)}, broadcast = True)
    print(f'Client (#{request.sid}) disconnected. Currently connected: {len(users)}')

### Game Events
@socketio.on('game-create')
def create_game(payload):

    gid = generate_ID(8)
    while gid in games:
        gid = generate_ID(8)
    g = amzn_state.create_from_size(payload["size"], payload["config"])

    games[gid] = {
        "gid": gid,
        "board": g,
        "players": [],
        "in_progress": False,
        "is_started": False
    }
    return {"result": "success", "gid": gid}

@socketio.on('game-join')
def game_join(payload):
    gid = payload["gid"]
    sid = request.sid

    user = users[sid]

    if gid and gid in games:
        g = games[gid]

        # Include player to game
        sckt.join_room("amazons_" + gid)
        if len(g["players"]) < 2:
            g["players"].append(sid)
            user["games_playing"].append(gid)
        else: # lobby full, observe instead
            user["games_observing"].append(gid)

        print("GAME PLAYERS:", g["players"])

        # Start game if full
        if len(g["players"]) == 2:
            g["is_started"] = True
            g["in_progress"] = True

        # Build Response
        response = g["board"].game_data()
        response["players"] = g["players"]
        response["in_progress"] = g["in_progress"]
        response["is_started"] = g["is_started"]
        sckt.emit("game-update-meta", response, to = "amazons_" + gid) # we want to emit these without emitting player specific data!

        # Client-specific info!
        response["client_is_player"] = request.sid in response["players"]
        response["client_side"] = 0 if not response["client_is_player"] else g["players"].index(request.sid) + 1
        print(json.dumps(users, indent = 2))
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
            
            if not b.is_valid_move(move):
                return {"result": "error", "error": "invalid move"}

            b.make_move(move)
        
            response = b.game_data()
            response["move"] = move
            response["players"] = g["players"]
            response["in_progress"] = g["in_progress"]
            sckt.emit("game-update-move", response, to = "amazons_" + gid)
            return {"result": "success"}

def handle_player_disconnect(gid, sid):
    games[gid]["in_progress"] = False
    games[gid]["resolution"] = "PLAYER_DISCONNECT"

    response = {
        "in_progress": False,
        "resolution": "PLAYER_DISCONNECT"
    }

    sckt.emit("game-update-meta", response, to = "amazons_" + gid)

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port='8080')