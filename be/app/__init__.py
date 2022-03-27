import json
import os
import pathlib
import time

import flask_socketio as sckt
import redis
from flask import current_app
from flask import Flask
from flask_session import Session
from flask_talisman import Talisman

from app import challenges
from app import main
from app import users


socketio = sckt.SocketIO()
CSP_POLICY = {
    "default-src": [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
    ],
    "connect-src": ["'self'", "ws://localhost:3000", "wss://strate.gg:3000"],
    "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
    ],
}
talisman = Talisman()
sess = Session()


def create_app(redis_instance=None, time_provider=None):

    if redis_instance is None:
        redis_instance = redis.Redis(
            host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"], db=0
        )

    if time_provider is None:
        time_provider = time

    app = Flask(__name__, instance_relative_config=False, static_folder="../client")

    load_app_configuration(app, redis_instance)

    with app.app_context():
        current_app.redis = redis_instance
        current_app.time_provider = time_provider

    # use init_app for all extensions
    sess.init_app(app)
    # NOTE: fill security hole with Flask-Session default serializer being pickle
    app.session_interface.serializer = json
    talisman.init_app(app, content_security_policy=CSP_POLICY)
    socketio.init_app(
        app,
        async_mode="eventlet",
        cors_allowed_origins=[
            "http://localhost",
            "http://127.0.0.1",
            "http://strate.gg",
            "https://localhost",
            "https://127.0.0.1",
            "https://strate.gg",
        ],
        manage_session=False,
    )

    # register blueprints
    app.register_blueprint(challenges.bp)
    app.register_blueprint(main.bp)

    users.online_user_service.reset_number_of_online_users(redis_instance)

    return app


def load_app_configuration(app, redis_instance):
    config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path(
        "secret_key.json"
    )

    with open(config_location) as config_file:
        app.config.update(json.load(config_file))  # load secret key

        app.config.update(
            SESSION_COOKIE_SECURE=True,
            SESSION_COOKIE_SAMESITE="Lax",
            SESSION_USE_SIGNER=True,
            SESSION_TYPE="redis",  # Flask-Session
            SESSION_REDIS=redis_instance,  # Flask-Session
        )
