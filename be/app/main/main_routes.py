import os

import requests
from flask import current_app
from flask import request
from flask import Response
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

    if current_app.debug:
        print("redirecting debug request to npm dev server")
        return proxy_to_npm_development_server()
    else:
        if path != "" and os.path.exists(current_app.static_folder + "/" + path):
            return send_from_directory(current_app.static_folder, path)
        else:
            return send_from_directory(current_app.static_folder, "index.html")


def proxy_to_npm_development_server():
    resp = requests.request(
        method="GET",
        url=request.url.replace(request.host, "localhost:3000"),
        headers={key: value for (key, value) in request.headers if key != "Host"},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False,
    )

    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = [
        (name, value)
        for (name, value) in resp.raw.headers.items()
        if name.lower() not in excluded_headers
    ]

    return Response(resp.content, resp.status_code, headers)
