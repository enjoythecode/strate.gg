import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_succesful
from .test_challenge_join import emit_join_challenge_with_cid
from .test_challenge_join import emit_succesful_amazons_create_challenge

SUCCESSFUL_AMAZONS_GAME = [{"from": "60", "to": "51", "shoot": "42"}]
INVALID_AMAZONS_MOVES = [{}, {"from": "00", "to": "00", "shoot": "00"}]


@pytest.mark.usefixtures("socketio_client_factory")
def test_can_move_in_amazons_challenge(socketio_client_factory):

    cid, users = create_challenge_between_two_clients(socketio_client_factory)
    response = emit_move_to_cid(users[0], SUCCESSFUL_AMAZONS_GAME[0], cid)

    assert_event_succesful(response)


@pytest.mark.usefixtures("socketio_client_factory")
@pytest.mark.parametrize("bad_move", INVALID_AMAZONS_MOVES)
def test_invalid_move_is_rejected_in_amazons_challenge(
    socketio_client_factory, bad_move
):
    cid, users = create_challenge_between_two_clients(socketio_client_factory)
    response = emit_move_to_cid(users[0], bad_move, cid)
    assert_event_errored(response)


def emit_move_to_cid(io_client, move, cid):
    return io_client.emit("challenge-move", {"cid": cid, "move": move}, callback=True)


def create_challenge_between_two_clients(socketio_client_factory):
    user_one = socketio_client_factory.create()
    user_two = socketio_client_factory.create()

    response = emit_succesful_amazons_create_challenge(user_one)

    cid = response["challenge"]["cid"]

    emit_join_challenge_with_cid(user_two, cid)

    return (cid, [user_one, user_two])
