from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
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
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")

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
def test_connect():
    print('Client connected')
    print(request.sid)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('game-create')
def create_game(payload):

    gid = generate_ID(8)
    while gid in games:
        gid = generate_ID(8)
    g = amzn_state.create_from_size(payload["size"], payload["config"])

    games[gid] = {
        "game": g,
        "users": [],
        "started": False
    }
    return {"result": "success", "gid": gid}

@socketio.on('game-join')
def get_game_data(payload):
    if payload["gid"] and payload["gid"] in games:

        # Include player to game
        # TODO

        # Start game if full
        # TODO
        
        # Build Response
        g = games[payload["gid"]]
        response = g["game"].game_data()
        response["players"] = g["users"]
        response["in_progress"] = False
        response["client_is_player"] = request.sid in response["players"]

        return {"result": "success", "info": response}
    else:
        print("err")
        return {"result": "error", "error": "Game not found."}

if __name__ == "__main__":
    socketio.run(app)