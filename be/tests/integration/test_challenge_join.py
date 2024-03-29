import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_succesful
from .test_challenge_helpers import emit_join_challenge_with_cid
from .test_challenge_helpers import emit_succesful_amazons_create_challenge


@pytest.mark.usefixtures("socketio_client_factory")
def test_can_join_amazons_challenge(socketio_client_factory):
    user_one = socketio_client_factory.create()
    user_two = socketio_client_factory.create()

    payload = emit_succesful_amazons_create_challenge(user_one)

    cid = payload["challenge"]["cid"]

    user_two_attempt = emit_join_challenge_with_cid(user_two, cid)
    assert_event_succesful(user_two_attempt)


@pytest.mark.usefixtures("socketio_client_factory")
def test_player_can_not_join_challenge_they_are_in(socketio_client_factory):

    user_one = socketio_client_factory.create()

    payload = emit_succesful_amazons_create_challenge(user_one)

    cid = payload["challenge"]["cid"]

    user_one_attempt = emit_join_challenge_with_cid(user_one, cid)
    assert_event_errored(user_one_attempt)


@pytest.mark.usefixtures("socketio_client_factory")
def test_player_can_not_join_a_full_challenge(socketio_client_factory):
    user_one = socketio_client_factory.create()
    user_two = socketio_client_factory.create()
    user_three = socketio_client_factory.create()

    cid = emit_succesful_amazons_create_challenge(user_one)["challenge"]["cid"]

    emit_join_challenge_with_cid(user_two, cid)
    user_three_attempt = emit_join_challenge_with_cid(user_three, cid)

    assert_event_errored(user_three_attempt)


def test_can_not_join_game_without_cid(socketio_client):
    response = socketio_client.emit("challenge-join", {}, callback=True)
    assert_event_errored(response)


@pytest.mark.usefixtures("socketio_client")
def test_can_not_join_game_with_invalid_cid(socketio_client):
    response = socketio_client.emit(
        "challenge-join", {"cid": "does-not-exist"}, callback=True
    )
    assert_event_errored(response)
