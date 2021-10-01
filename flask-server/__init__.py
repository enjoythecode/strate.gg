from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
import os

games = {}
users = {}

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev')

    @app.route('/')
    def serve_index():
        return app.send_static_file('index.html')

    # Vue front-end, WIP
    @app.route('/game.html')
    def serve_game():
        return app.send_static_file('game.html')

    return app