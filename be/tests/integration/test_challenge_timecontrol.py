import pytest

from .conf_websocket import assert_event_includes_challenge_data
from .conf_websocket import assert_event_succesful

TIME_CONTROL_BASE = 10 * 60
TIME_CONTROL_INCREMENT = 5


@pytest.mark.usefixtures("socketio_client")
def test_can_create_amazons_game_with_time_control(socketio_client):

    payload = emit_succesful_amazons_create_with_time_control(socketio_client)

    assert_event_succesful(payload)
    assert_event_includes_challenge_data(payload)

    challenge_data = payload["challenge"]
    assert "time_control" in challenge_data
    time_control = challenge_data["time_control"]

    assert "time_config" in time_control
    time_config = time_control["time_config"]

    assert time_config["base_s"] == TIME_CONTROL_BASE
    assert time_config["increment_s"] == TIME_CONTROL_INCREMENT


# todo: test what happens to time control on move
# todo: test what happens on time end
# - todo: test when a move is submitted after time was up
# - todo: test the "test-for-time-control" request by the client
# todo: test bad/malicious inputs
# todo: test what happens when you don't pass in a time control


def emit_succesful_amazons_create_with_time_control(io_client):
    return io_client.emit(
        "challenge-create",
        {
            "game_name": "amazons",
            "time_config": {
                "base_s": TIME_CONTROL_BASE,
                "increment_s": TIME_CONTROL_INCREMENT,
            },  # 10 + 5
            "game_config": {"size": 10, "variation": 0},
        },
        callback=True,
    )
