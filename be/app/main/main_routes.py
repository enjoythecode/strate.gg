import os

from flask import current_app
from flask import send_from_directory

from app.main import bp
from app.users import user_service


@bp.route("/", defaults={"path": ""})  #
# TODO switch this to /static/<path:path> (coordinate with FE)
@bp.route("/<path:path>")
def serve(path):

    # note: sessions are handled server side in Redis, and that is why setting
    # the cookie once is enough. this is also how we get access to the Flask
    # session in Flask-SocketIO: socketio defers session management with the
    # manage_session = False setting on initialization.
    user_service.setup_server_side_session_cookie()

    if path != "" and os.path.exists(current_app.static_folder + "/" + path):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, "index.html")
