import json
import pathlib

import flask_socketio as sckt
import redis
from flask import Flask
from flask import g
from flask_session import Session

from blueprints import debug

socketio = sckt.SocketIO()
sess = Session()


def create_app():
    # create and configure the app
    # XXX: we will likely want to change the static_folder
    app = Flask(__name__, instance_relative_config=False, static_folder="../fe/build")
    load_app_configuration(app)

    r = redis.Redis(host="redis", port=6379, db=0)

    attach_resources_to_g(app, redis_client=r)

    sess.init_app(app)
    socketio.init_app(
        app,
        # XXX: cors_allowed_origins="*"????
        async_mode="eventlet",
        cors_allowed_origins="*",
        manage_session=False,
    )

    app.register_blueprint(debug.bp)

    return app


def load_app_configuration(app):
    config_location = pathlib.Path(__file__).parent.absolute() / pathlib.Path(
        "config.json"
    )

    with open(config_location) as config_file:
        app.config.update(json.load(config_file))  # load secret key

        app.config.update(
            # SESSION_TYPE="redis",  # Flask-Session
            # SESSION_REDIS=r,# Flask-Session uses the existing redis connection object
        )


def attach_resources_to_g(app, redis_client):
    @app.before_request
    def attach_resources():
        g.redis = redis_client


if __name__ == "__main__":
    app = create_app()
    socketio.run(app, host="0.0.0.0", port="8080")
