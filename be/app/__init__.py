import json
import pathlib

import flask_socketio as sckt
import redis
from flask import current_app
from flask import Flask
from flask_session import Session

from app import challenges
from app import main


socketio = sckt.SocketIO()
sess = Session()
r = redis.Redis(host="localhost", port=6379, db=0)


def create_app():
    # create and configure the app
    # XXX: we will likely want to change the static_folder
    app = Flask(__name__, instance_relative_config=False, static_folder="../fe/build")
    load_app_configuration(app)

    # use init_app for all extensions
    with app.app_context():
        current_app.redis = r
    # app.redis = r
    sess.init_app(app)
    # NOTE: fill security hole with Flask-Session default serializer being pickle
    app.session_interface.serializer = json
    socketio.init_app(
        app,
        # XXX: cors_allowed_origins="*"????
        async_mode="eventlet",
        cors_allowed_origins="*",
        manage_session=False,
    )

    # register blueprints
    app.register_blueprint(challenges.bp)
    app.register_blueprint(main.bp)

    return app


def load_app_configuration(app):
    config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path(
        "secret_key.json"
    )

    with open(config_location) as config_file:
        app.config.update(json.load(config_file))  # load secret key
        # get_redis_at_runtime = lambda: app.extensions["redis"]
        app.config.update(
            SESSION_TYPE="redis",  # Flask-Session
            SESSION_REDIS=r,  # Flask-Session
            # REDIS_HOST="localhost",
            # REDIS_PORT="6379",
        )
