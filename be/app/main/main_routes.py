import os

from flask import current_app
from flask import redirect
from flask import send_from_directory

from app.main import bp
from app.users import user_service


@bp.route("/", defaults={"path": ""})  #
# TODO switch this to /static/<path:path> (coordinate with FE)
@bp.route("/<path:path>")
def serve(path):

    # in the development environment, the client files are served by the npm
    # development server which is on a different port. in production, they
    # are built by npm and served by flask within this method
    # to get the same session flow between dev and prod, we set the session
    # here at the base url for the Flask app *in debug mode only*
    # that means that you should go to localhost:8080 when testing the data
    # in your local environment.
    # note: sessions are handled server side in Redis, and that is why setting
    # the cookie once is enough. this is also how we get access to the Flask
    # session in Flask-SocketIO: socketio defers session management with the
    # manage_session = False setting on initialization.
    if current_app.debug:
        user_service.setup_server_side_session_cookie()
        return redirect("http://localhost:3000")

    if path != "" and os.path.exists(current_app.static_folder + "/" + path):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, "index.html")
