import functools

from flask import Blueprint
from flask import current_app

bp = Blueprint("debug", __name__, url_prefix="/debug")


def only_allow_access_in_debug_mode(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if current_app.debug:  # pragma: no cover
            return f(*args, **kwargs)

    return decorated_function


@bp.route("/hi")
@only_allow_access_in_debug_mode
def test_extensions():  # pragma: no cover
    print(current_app.extensions)
    return "Hello, world!"


@bp.route("/r/ping")
def rdb_ping():  # pragma: no cover
    redis_alive = current_app.redis.ping()
    return "alive" if redis_alive else "dead"
