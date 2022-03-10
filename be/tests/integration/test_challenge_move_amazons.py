import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_succesful
from .data_test import FULL_AMAZON_GAME
from .test_challenge_helpers import (
    create_challenge_between_two_clients_and_subscribe_players_to_it,
)
from .test_challenge_helpers import emit_move_to_cid
from .test_challenge_helpers import emit_succesful_amazons_create_challenge
from .test_challenge_helpers import get_latest_challenge_update_ioclient_received
from .test_challenge_helpers import subscribe_user_to_challenge
from .test_challenge_helpers import unsubscribe_user_from_challenge

INVALID_AMAZONS_MOVES = [{}, {"from": "00", "to": "00", "shoot": "00"}]


def test_can_move_in_amazons_challenge(socketio_client_factory):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    response = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    assert_event_succesful(response)


@pytest.mark.parametrize("bad_move", INVALID_AMAZONS_MOVES)
def test_invalid_move_is_rejected_in_amazons_challenge(
    socketio_client_factory, bad_move
):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    response = emit_move_to_cid(users[0], bad_move, cid)
    assert_event_errored(response)


def test_challenge_is_broadcasted_consistently_after_move(
    socketio_client_factory,
):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    user_one_knows = get_latest_challenge_update_ioclient_received(users[0])
    user_two_knows = get_latest_challenge_update_ioclient_received(users[1])

    assert user_one_knows == user_two_knows


def test_challenge_is_broadcasted_correctly(
    socketio_client_factory,
):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    user_two_knows = get_latest_challenge_update_ioclient_received(users[1])

    assert user_two_knows["challenge"]["state"]["turn"] == 1
    assert user_two_knows["challenge"]["state"]["number_of_turns"] == 1
    assert len(user_two_knows["challenge"]["moves"])
    assert user_two_knows["challenge"]["moves"] == [FULL_AMAZON_GAME[0]]


def test_challenge_moves_are_not_broadcasted_after_unsub(
    socketio_client_factory,
):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    unsubscribe_user_from_challenge(users[1], cid)
    users[1].get_received()  # clear their queue

    emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    received_events_keys = [event["name"] for event in users[1].get_received()]

    assert "challenge-update" not in received_events_keys
    assert len(received_events_keys) == 0


def test_amazons_challenge_can_play_full_game(socketio_client_factory):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    for i in range(len(FULL_AMAZON_GAME)):
        move = FULL_AMAZON_GAME[i]
        r = emit_move_to_cid(users[i % 2], move, cid)
        assert_event_succesful(r)


def test_amazons_challenge_can_not_move_in_game_that_did_not_start(
    socketio_client_factory,
):
    user_one = socketio_client_factory.create()

    response = emit_succesful_amazons_create_challenge(user_one)
    cid = response["challenge"]["cid"]

    subscribe_user_to_challenge(user_one, cid)

    r = emit_move_to_cid(user_one, FULL_AMAZON_GAME[0], cid)
    assert_event_errored(r)


def test_amazons_challenge_player_cannot_move_out_of_turn(socketio_client_factory):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    # second player can not move out of turn
    r = emit_move_to_cid(users[1], FULL_AMAZON_GAME[0], cid)
    assert_event_errored(r)

    # first player moves correctly
    r = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)
    assert_event_succesful(r)

    # and they can not play again
    r = emit_move_to_cid(users[0], FULL_AMAZON_GAME[1], cid)
    assert_event_errored(r)


def test_amazons_challenge_observer_may_not_move(socketio_client_factory):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    r = emit_move_to_cid(users[1], FULL_AMAZON_GAME[0], cid)
    assert_event_errored(r)


def test_test_method_get_latest_challenge_is_none_if_no_events(socketio_client):
    _ = socketio_client.get_received()  # flush received events
    assert get_latest_challenge_update_ioclient_received(socketio_client) is None
