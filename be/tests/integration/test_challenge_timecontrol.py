from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_includes_challenge_data
from .conf_websocket import assert_event_succesful
from .test_challenge_helpers import (
    create_challenge_between_two_clients_and_subscribe_players_to_it,
)
from .test_challenge_helpers import emit_move_to_cid
from .test_challenge_helpers import get_latest_challenge_update_ioclient_received
from .test_challenge_move_amazons import FULL_AMAZON_GAME

TIME_CONTROL_BASE = 10 * 60
TIME_CONTROL_INCREMENT = 5


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


def test_challenge_time_control_starts_on_first_move_and_not_game_creation(
    socketio_client_factory, test_time_provider
):

    GAME_CREATE_MOCK_TS = 1234567890.123456  # epoch, decimal is millisecond
    FIRST_MOVE_MOCK_TS = GAME_CREATE_MOCK_TS + 10  # first move 10 seconds after

    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS)
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory, time_control=True
    )

    test_time_provider.set_mocked_time(FIRST_MOVE_MOCK_TS)
    _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    payload = get_latest_challenge_update_ioclient_received(users[0])

    time_control = payload["challenge"]["time_control"]

    expected_time_control = {
        "time_config": {
            "base_s": TIME_CONTROL_BASE,
            "increment_s": TIME_CONTROL_INCREMENT,
        },
        "last_move_ts": FIRST_MOVE_MOCK_TS,
        "remaining_times_s": [TIME_CONTROL_BASE, TIME_CONTROL_BASE],
    }

    assert time_control == expected_time_control


def test_time_control_counts_down_correctly(
    socketio_client_factory, test_time_provider
):

    GAME_CREATE_MOCK_TS = 1000000000.000000  # epoch, decimal is millisecond

    MOVE_DELAYS = [16, 3, 18, 6]
    FIRST_MOVE_MOCK_TS = GAME_CREATE_MOCK_TS + MOVE_DELAYS[0]
    SECOND_MOVE_MOCK_TS = FIRST_MOVE_MOCK_TS + MOVE_DELAYS[1]
    THIRD_MOVE_MOCK_TS = SECOND_MOVE_MOCK_TS + MOVE_DELAYS[2]
    FOURTH_MOVE_MOCK_TS = THIRD_MOVE_MOCK_TS + MOVE_DELAYS[3]
    MOVE_MOCK_TSS = [
        FIRST_MOVE_MOCK_TS,
        SECOND_MOVE_MOCK_TS,
        THIRD_MOVE_MOCK_TS,
        FOURTH_MOVE_MOCK_TS,
    ]
    EXPECTED_REMAINING_TIMES_S = [
        [TIME_CONTROL_BASE, TIME_CONTROL_BASE],  # after first move, clock starts
        [
            TIME_CONTROL_BASE,
            TIME_CONTROL_BASE + TIME_CONTROL_INCREMENT - MOVE_DELAYS[1],
        ],
        [
            TIME_CONTROL_BASE + TIME_CONTROL_INCREMENT - MOVE_DELAYS[2],
            TIME_CONTROL_BASE + TIME_CONTROL_INCREMENT - MOVE_DELAYS[1],
        ],
        [
            TIME_CONTROL_BASE + TIME_CONTROL_INCREMENT - MOVE_DELAYS[2],
            TIME_CONTROL_BASE
            + TIME_CONTROL_INCREMENT * 2
            - MOVE_DELAYS[1]
            - MOVE_DELAYS[3],
        ],
    ]

    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS)
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory, time_control=True
    )

    for move_i in range(len(MOVE_MOCK_TSS)):
        move = FULL_AMAZON_GAME[move_i]
        mock_ts = MOVE_MOCK_TSS[move_i]
        user_i = move_i % 2

        test_time_provider.set_mocked_time(mock_ts)
        _ = emit_move_to_cid(users[user_i], move, cid)

        payload = get_latest_challenge_update_ioclient_received(users[0])

        time_control = payload["challenge"]["time_control"]

        assert time_control["last_move_ts"] == mock_ts
        assert time_control["remaining_times_s"] == EXPECTED_REMAINING_TIMES_S[move_i]


def test_that_move_after_game_clock_is_up_terminates_game(
    socketio_client_factory, test_time_provider
):
    GAME_CREATE_MOCK_TS = 1000000000.000000  # epoch, decimal is millisecond

    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS)
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory, time_control=True
    )

    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS + 5)
    _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    # really late second move!
    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS + TIME_CONTROL_BASE + 1e4)
    _ = emit_move_to_cid(users[1], FULL_AMAZON_GAME[1], cid)

    payload = get_latest_challenge_update_ioclient_received(users[0])
    assert payload["challenge"]["status"] == "OVER_TIME"
    assert payload["challenge"]["player_won"] == 0


def test_time_control_assert_request_terminates_game_if_time_is_up(
    socketio_client_factory, test_time_provider
):
    GAME_CREATE_MOCK_TS = 1000000000.000000  # epoch, decimal is millisecond
    FIRST_MOVE_TS = GAME_CREATE_MOCK_TS + 5
    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS)
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory, time_control=True
    )

    test_time_provider.set_mocked_time(FIRST_MOVE_TS)
    _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    # 2 seconds after the 2nd player time was up...
    test_time_provider.set_mocked_time(FIRST_MOVE_TS + TIME_CONTROL_BASE + 2)
    response = emit_clock_check(users[0], cid)

    assert_event_succesful(response)

    payload = get_latest_challenge_update_ioclient_received(users[0])
    assert payload["challenge"]["status"] == "OVER_TIME"
    assert payload["challenge"]["player_won"] == 0


def test_time_control_assert_request_returns_error_if_time_is_not_up(
    socketio_client_factory, test_time_provider
):
    GAME_CREATE_MOCK_TS = 1000000000.000000  # epoch, decimal is millisecond
    FIRST_MOVE_TS = GAME_CREATE_MOCK_TS + 5
    test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS)
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory, time_control=True
    )

    test_time_provider.set_mocked_time(FIRST_MOVE_TS)
    _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    # 2 seconds BEFORE the 2nd player time was up...
    test_time_provider.set_mocked_time(FIRST_MOVE_TS + TIME_CONTROL_BASE - 2)
    response = emit_clock_check(users[0], cid)

    assert_event_errored(response)

    payload = get_latest_challenge_update_ioclient_received(users[0])
    assert payload["challenge"]["status"] == "IN_PROGRESS"
    assert payload["challenge"]["player_won"] == -1


# todo: parametrize time_control tests with different time controls
# todo: test bad/malicious inputs
# todo: test what happens when you don't pass in a time control
# todo: error handling improvement, at least dump the stack trace when testing, please!


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


def emit_clock_check(io_client, cid):
    return io_client.emit("challenge-clock-check", {"cid": cid}, callback=True)
