from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
from ai.amazons_state import AmazonsState as amzn_state
import os

games = {}
users = {}

# create and configure the app
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY = 'dev',
    DEBUG = True
)
socketio = SocketIO(app, async_mode="eventlet")

############ ROUTES ###############
@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

# Vue front-end, WIP
@app.route('/game.html')
def serve_game():
    return app.send_static_file('game.html')

############# SOCKETS #############
@socketio.on('message')
def handle_message(data):
    print('Received message:', data)

@socketio.on('game-create')
def create_game(payload):
    g = amzn_state.create_from_size(payload["size"], payload["config"])
    print(g)
    #users.append({username : request.sid})
    #print(users)
    print('Game created!')

if __name__ == "__main__":
    socketio.run(app)