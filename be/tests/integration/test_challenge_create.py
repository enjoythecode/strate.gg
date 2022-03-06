import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_includes_challenge_data
from .conf_websocket import assert_event_succesful
from .test_websocket_connection import (
    get_uid_from_websocket_connection_player_id_event,
)


WRONG_AMAZONS_CONFIGURATIONS = [
    {},
    {"game_config": {"size": 10, "variation": 0}},
    {"game_name": "amazons"},
    {"game_name": "amazons", "game_config": {"size": 10}},
    {"game_name": "amazons", "game_config": {"variation": 0}},
    {"game_name": "amazons", "game_config": {"size": 4}},
    {"game_name": "amazons", "game_config": {"size": 10, "variation": -1}},
    {
        "game_name": "amazons",
        "game_config": {"size": "fooled you!", "variation": True},
    },
    {"game_name": "snozama", "game_config": {"size": 10, "variation": 0}},
]


@pytest.mark.usefixtures("socketio_client")
def test_can_create_amazons_game(socketio_client):

    payload = emit_succesful_amazons_create_from_client(socketio_client)

    assert_event_succesful(payload)
    assert_event_includes_challenge_data(payload)


@pytest.mark.usefixtures("socketio_client")
def test_created_amazons_game_includes_my_uid_as_a_player(socketio_client):

    socketio_client.flask_test_client.get("/")
    user_id = get_uid_from_websocket_connection_player_id_event(socketio_client)

    response = emit_succesful_amazons_create_from_client(socketio_client)

    assert user_id in response["challenge"]["players"]


@pytest.mark.usefixtures("socketio_client")
@pytest.mark.parametrize("bad_payload", WRONG_AMAZONS_CONFIGURATIONS)
def test_create_amazons_game_fails_with_invalid_payload(socketio_client, bad_payload):

    payload = socketio_client.emit("challenge-create", bad_payload, callback=True)
    assert_event_errored(payload)


def emit_succesful_amazons_create_from_client(io_client):
    return io_client.emit(
        "challenge-create",
        {"game_name": "amazons", "game_config": {"size": 10, "variation": 0}},
        callback=True,
    )
