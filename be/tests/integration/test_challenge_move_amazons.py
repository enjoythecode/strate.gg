import pytest

from .conf_websocket import assert_event_errored
from .conf_websocket import assert_event_succesful
from .data_test import FULL_AMAZON_GAME
from .test_challenge_join import emit_join_challenge_with_cid
from .test_challenge_join import emit_succesful_amazons_create_challenge

INVALID_AMAZONS_MOVES = [{}, {"from": "00", "to": "00", "shoot": "00"}]


@pytest.mark.usefixtures("socketio_client_factory")
def test_can_move_in_amazons_challenge(socketio_client_factory):

    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    response = emit_move_to_cid(users[0], FULL_AMAZON_GAME[0], cid)

    assert_event_succesful(response)


@pytest.mark.usefixtures("socketio_client_factory")
@pytest.mark.parametrize("bad_move", INVALID_AMAZONS_MOVES)
def test_invalid_move_is_rejected_in_amazons_challenge(
    socketio_client_factory, bad_move
):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )
    response = emit_move_to_cid(users[0], bad_move, cid)
    assert_event_errored(response)


@pytest.mark.usefixtures("socketio_client_factory")
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


@pytest.mark.usefixtures("socketio_client_factory")
def test_challenge_is_broadcasted_correctly_(
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


@pytest.mark.usefixtures("socketio_client_factory")
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


@pytest.mark.usefixtures("socketio_client_factory")
def test_amazons_challenge_can_play_full_game(socketio_client_factory):
    cid, users = create_challenge_between_two_clients_and_subscribe_players_to_it(
        socketio_client_factory
    )

    for i in range(len(FULL_AMAZON_GAME)):
        move = FULL_AMAZON_GAME[i]
        r = emit_move_to_cid(users[i % 2], move, cid)

    print(r)


def emit_move_to_cid(io_client, move, cid):
    return io_client.emit("challenge-move", {"cid": cid, "move": move}, callback=True)


def create_challenge_between_two_clients_and_subscribe_players_to_it(
    socketio_client_factory,
):
    user_one = socketio_client_factory.create()
    user_two = socketio_client_factory.create()

    response = emit_succesful_amazons_create_challenge(user_one)
    cid = response["challenge"]["cid"]

    subscribe_user_to_challenge(user_one, cid)

    emit_join_challenge_with_cid(user_two, cid)
    subscribe_user_to_challenge(user_two, cid)

    return (cid, [user_one, user_two])


def subscribe_user_to_challenge(user, cid):
    response = user.emit("challenge-subscribe", {"cid": cid}, callback=True)
    return response


def unsubscribe_user_from_challenge(user, cid):
    response = user.emit("challenge-unsubscribe", {"cid": cid}, callback=True)
    return response


def get_latest_challenge_update_ioclient_received(io_client):
    events = io_client.get_received()
    for event in events[::-1]:
        if event["name"] == "challenge-update":
            return event["args"][0]

    return None


@pytest.mark.usefixtures("socketio_client")
def test_test_method_get_latest_challenge_is_none_if_no_events(socketio_client):
    _ = socketio_client.get_received()  # flush received events
    assert get_latest_challenge_update_ioclient_received(socketio_client) is None
