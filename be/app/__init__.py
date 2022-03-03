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


def create_app(redis_instance=None):

    if redis_instance is None:
        redis_instance = redis.Redis(host="redis", port=6379, db=0)

    app = Flask(__name__, instance_relative_config=False, static_folder="../client")

    load_app_configuration(app, redis_instance)

    with app.app_context():
        current_app.redis = redis_instance

    # use init_app for all extensions
    sess.init_app(app)
    # NOTE: fill security hole with Flask-Session default serializer being pickle
    app.session_interface.serializer = json
    socketio.init_app(
        app,
        async_mode="eventlet",
        cors_allowed_origins=[
            "http://localhost:3000",
            "http://localhost:8080",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
        ],
        manage_session=False,
    )

    # register blueprints
    app.register_blueprint(challenges.bp)
    app.register_blueprint(main.bp)

    return app


def load_app_configuration(app, redis_instance):
    config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path(
        "secret_key.json"
    )

    with open(config_location) as config_file:
        app.config.update(json.load(config_file))  # load secret key
        # get_redis_at_runtime = lambda: app.extensions["redis"]
        app.config.update(
            SESSION_COOKIE_SECURE=True,
            SESSION_COOKIE_SAMESITE="Lax",
            SESSION_USE_SIGNER=True,
            SESSION_TYPE="redis",  # Flask-Session
            SESSION_REDIS=redis_instance,  # Flask-Session
            # REDIS_HOST="localhost",
            # REDIS_PORT="6379",
        )
