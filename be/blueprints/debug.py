import functools

from flask import Blueprint
from flask import current_app
from flask import g
from flask import request

bp = Blueprint("debug", __name__, url_prefix="/debug")


def only_allow_access_in_debug_mode(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if current_app.debug:
            return f(*args, **kwargs)

    return decorated_function


@bp.route("/hi")
@only_allow_access_in_debug_mode
def test_extensions():
    print(current_app.extensions)
    return "Hello, world!"


@bp.route("/r/ping")
def rdb_ping():
    redis_alive = g.redis.ping()
    return "alive" if redis_alive else "dead"


if False:

    @bp.route("/r/set")
    def rdb_set():
        key = request.args.get("key")
        val = request.args.get("val")
        response = 1  # XXX  r.set(key, val)
        print(f"set {key} => {val}. got {response}")
        return "OK"

    @bp.route("/r/get")
    def rdb_get():
        key = request.args.get("key")
        response = "some_key XXX"  # XXX r.get(key)
        print(f"got {key}; {response}")
        return str(response)
