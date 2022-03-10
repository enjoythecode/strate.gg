import pytest

from .test_challenge_helpers import (
    create_challenge_between_two_clients_and_subscribe_players_to_it,
)
from .test_challenge_helpers import subscribe_user_to_challenge
from .test_challenge_move_amazons import get_latest_challenge_update_ioclient_received


@pytest.mark.parametrize("user_index_to_disconnect", [0, 1])
def test_user_disconnecting_defaults_the_win_to_the_other_player(
    socketio_client_factory, user_index_to_disconnect
):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    users[user_index_to_disconnect].disconnect()
    remaining_user = (user_index_to_disconnect + 1) % 2

    latest_update = get_latest_challenge_update_ioclient_received(users[remaining_user])

    assert latest_update["challenge"]["status"] == "OVER_DISCONNECT"
    assert latest_update["challenge"]["player_won"] == remaining_user + 1


def test_user_subscribing_to_game_after_gets_correct_game_information(
    socketio_client_factory,
):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    users[0].disconnect()

    latest_update = get_latest_challenge_update_ioclient_received(users[1])

    user_three = socketio_client_factory.create()
    subscribe_user_to_challenge(user_three, cid)
    user_three_knowledge = get_latest_challenge_update_ioclient_received(users[1])

    assert latest_update == user_three_knowledge
