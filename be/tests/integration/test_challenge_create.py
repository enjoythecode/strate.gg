import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_includes_challenge_data
from .conf_websocket import assert_event_succesful


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

    payload = socketio_client.emit(
        "challenge-create",
        {"game_name": "amazons", "game_config": {"size": 10, "variation": 0}},
        callback=True,
    )

    assert_event_succesful(payload)
    assert_event_includes_challenge_data(payload)


@pytest.mark.usefixtures("socketio_client")
@pytest.mark.parametrize("bad_payload", WRONG_AMAZONS_CONFIGURATIONS)
def test_create_amazons_game_fails_with_invalid_payload(socketio_client, bad_payload):

    payload = socketio_client.emit("challenge-create", bad_payload, callback=True)
    assert_event_errored(payload)
