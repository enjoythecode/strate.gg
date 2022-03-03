from flask_socketio import join_room
from flask_socketio import leave_room

from app.challenges import bp
from app.challenges import challenge_service
from app.users import user_service


@bp.on("challenge-create")
def create_challenge(payload):
    # TODO: what happens on an error?
    # XXX: (application TODO generally)

    if not ("game_name" in payload and "game_config" in payload):
        raise BaseException

    challenge = challenge_service.create_challenge(
        payload["game_name"], payload["game_config"]
    )

    return {"result": "success", "challenge": challenge}


@bp.on("challenge-join")
def challenge_join(payload):
    # TODO how to do more comprehensive check of user input?
    if "cid" in payload:
        cid = payload["cid"]
    else:
        raise BaseException  # bad input

    uid = user_service.get_uid_of_session_holder()

    response = challenge_service.add_player_to_challenge(uid, cid)
    return response


@bp.on("challenge-move")
def challenge_move(payload):
    challenge_service.handle_move(payload["cid"], payload["move"])


@bp.on("challenge-subscribe")
def handle_challenge_subscribe(payload):
    room = challenge_service.socket_room_name_from_cid(payload["cid"])
    join_room(room)
    challenge_service.send_challenge_update_to_clients(
        challenge_service._get_challenge_by_cid(payload["cid"])
    )


@bp.on("challenge-unsubscribe")
def handle_challenge_unsubscribe(payload):
    room = challenge_service.socket_room_name_from_cid(payload["cid"])
    leave_room(room)
