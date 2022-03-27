import pytest

from .test_challenge_helpers import subscribe_user_to_challenge
from .test_challenge_move_amazons import get_latest_challenge_update_ioclient_received


@pytest.mark.parametrize("user_index_to_disconnect", [0, 1])
def test_user_disconnecting_defaults_the_win_to_the_other_player(
    amazons_challenge_no_clock, user_index_to_disconnect
):

    cid, users = amazons_challenge_no_clock

    users[user_index_to_disconnect].disconnect()
    remaining_user = (user_index_to_disconnect + 1) % 2

    latest_update = get_latest_challenge_update_ioclient_received(users[remaining_user])

    assert latest_update["challenge"]["status"] == "OVER_DISCONNECT"
    assert latest_update["challenge"]["player_won"] == remaining_user


def test_user_subscribing_to_game_after_gets_correct_game_information(
    socketio_client_factory, amazons_challenge_no_clock
):

    cid, users = amazons_challenge_no_clock

    users[0].disconnect()

    latest_update = get_latest_challenge_update_ioclient_received(users[1])

    user_three = socketio_client_factory.create()
    subscribe_user_to_challenge(user_three, cid)
    user_three_knowledge = get_latest_challenge_update_ioclient_received(users[1])

    assert latest_update == user_three_knowledge
