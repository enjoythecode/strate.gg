import pytest

from .test_challenge_move_amazons import (
    create_challenge_between_two_clients_and_subscribe_players_to_it,
)
from .test_challenge_move_amazons import get_latest_challenge_update_ioclient_received


@pytest.mark.usefixtures("socketio_client_factory")
@pytest.mark.parametrize("user_index_to_disconnect", [0, 1])
def test_can_move_in_amazons_challenge(
    socketio_client_factory, user_index_to_disconnect
):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    users[user_index_to_disconnect].disconnect()
    remaining_user = (user_index_to_disconnect + 1) % 2

    latest_update = get_latest_challenge_update_ioclient_received(users[remaining_user])

    assert latest_update["challenge"]["status"] == "OVER_DISCONNECT"
    assert latest_update["challenge"]["game_end_override"] == remaining_user + 1
