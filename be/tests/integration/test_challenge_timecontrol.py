import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_succesful
from .conftest import create_amazons_challenge
from .test_challenge_helpers import emit_move_to_cid
from .test_challenge_helpers import get_latest_challenge_update_ioclient_received
from .test_challenge_move_amazons import FULL_AMAZON_GAME

TIME_CONTROL_BASE = 10 * 60
TIME_CONTROL_INCREMENT = 5
GAME_CREATE_MOCK_TS = 1000000000.000000  # epoch, decimal is millisecond


class TestChallengeTimeControl:
    @pytest.fixture
    def amazons_challenge_with_clock(self, socketio_client_factory):
        return create_amazons_challenge(socketio_client_factory, time_control=True)

    def test_challenge_time_control_starts_on_first_move_and_not_game_creation(
        self, amazons_challenge_with_clock, test_time_provider
    ):

        FIRST_MOVE_MOCK_TS = GAME_CREATE_MOCK_TS + 10  # first move 10 seconds after

        cid, users = amazons_challenge_with_clock

        test_time_provider.set_mocked_time(FIRST_MOVE_MOCK_TS)
        _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

        payload = get_latest_challenge_update_ioclient_received(users[0])

        expected_time_control = {
            "time_config": {
                "base_s": TIME_CONTROL_BASE,
                "increment_s": TIME_CONTROL_INCREMENT,
            },
            "last_move_ts": FIRST_MOVE_MOCK_TS,
            "remaining_times_s": [TIME_CONTROL_BASE, TIME_CONTROL_BASE],
        }

        assert payload["challenge"]["time_control"] == expected_time_control

    def test_time_control_counts_down_correctly(
        self, amazons_challenge_with_clock, test_time_provider
    ):

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

        cid, users = amazons_challenge_with_clock

        for move_i in range(len(MOVE_MOCK_TSS)):
            move = FULL_AMAZON_GAME[move_i]
            mock_ts = MOVE_MOCK_TSS[move_i]
            user_i = move_i % 2

            test_time_provider.set_mocked_time(mock_ts)
            _ = emit_move_to_cid(users[user_i], move, cid)

            payload = get_latest_challenge_update_ioclient_received(users[0])

            time_control = payload["challenge"]["time_control"]

            assert time_control["last_move_ts"] == mock_ts
            assert (
                time_control["remaining_times_s"] == EXPECTED_REMAINING_TIMES_S[move_i]
            )

    def test_that_move_after_game_clock_is_up_terminates_game(
        self, amazons_challenge_with_clock, test_time_provider
    ):
        cid, users = amazons_challenge_with_clock

        test_time_provider.set_mocked_time(GAME_CREATE_MOCK_TS + 5)
        _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

        # really late second move!
        test_time_provider.set_mocked_time(
            GAME_CREATE_MOCK_TS + TIME_CONTROL_BASE + 1e4
        )
        _ = emit_move_to_cid(users[1], FULL_AMAZON_GAME[1], cid)

        payload = get_latest_challenge_update_ioclient_received(users[0])
        assert payload["challenge"]["status"] == "OVER_TIME"
        assert payload["challenge"]["player_won"] == 0

    def test_time_control_assert_request_terminates_game_if_time_is_up(
        self, amazons_challenge_with_clock, test_time_provider
    ):
        FIRST_MOVE_TS = GAME_CREATE_MOCK_TS + 5
        cid, users = amazons_challenge_with_clock

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
        self, amazons_challenge_with_clock, test_time_provider
    ):
        FIRST_MOVE_TS = GAME_CREATE_MOCK_TS + 5
        cid, users = amazons_challenge_with_clock

        test_time_provider.set_mocked_time(FIRST_MOVE_TS)
        _ = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

        # 2 seconds BEFORE the 2nd player time was up...
        test_time_provider.set_mocked_time(FIRST_MOVE_TS + TIME_CONTROL_BASE - 2)
        response = emit_clock_check(users[0], cid)

        assert_event_errored(response)

        payload = get_latest_challenge_update_ioclient_received(users[0])
        assert payload["challenge"]["status"] == "IN_PROGRESS"
        assert payload["challenge"]["player_won"] == -1


def emit_clock_check(io_client, cid):
    return io_client.emit("challenge-clock-check", {"cid": cid}, callback=True)
