from flask import request

from app.challenges import challenge_service
from app.main import bp
from app.users import online_user_service
from app.users import user_service


def notify_client_of_their_uid(uid, sid):
    bp.emit("connection-player-id", {"uid": uid}, to=sid)


@bp.on("message")
def handle_message(data):
    """
    There are no defined/expected "message" events in the current architecture.
    We want to define this handler so that we can raise a concern.
    """
    # TODO: switch this to logging:warning
    print("UNEXPECTED received message: ", data)


@bp.on("connect")
def handle_connect():
    # TODO: require an UID
    uid = user_service.get_uid_of_session_holder()
    notify_client_of_their_uid(uid, request.sid)

    online_user_service.process_connect_from_user(uid)


@bp.on("disconnect")
def handle_disconnect():
    # TODO: require an UID
    uid = user_service.get_uid_of_session_holder()
    online_user_service.process_disconnect_from_user(uid)
    challenge_service.process_disconnect_from_user(uid)
