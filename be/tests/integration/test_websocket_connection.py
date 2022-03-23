import pytest

from .test_main_routes import get_session_value_from_response


@pytest.mark.usefixtures("socketio_client")
def test_socketio_can_connect(socketio_client):
    assert socketio_client.is_connected()


@pytest.mark.usefixtures("socketio_client")
def test_socketio_connection_return_userid(socketio_client):
    uid = get_uid_from_websocket_connection_player_id_event(socketio_client)

    assert uid


@pytest.mark.usefixtures("socketio_client")
def test_socketio_same_uid_across_disconnects(socketio_client):

    first_response = socketio_client.flask_test_client.get("/")
    first_user_id = get_uid_from_websocket_connection_player_id_event(socketio_client)

    socketio_client.disconnect()
    socketio_client.connect()

    second_response = socketio_client.flask_test_client.get("/")
    second_user_id = get_uid_from_websocket_connection_player_id_event(socketio_client)

    first_sess = get_session_value_from_response(first_response)
    second_sess = get_session_value_from_response(second_response)

    assert first_user_id == second_user_id
    assert first_sess == second_sess


@pytest.mark.usefixtures("socketio_client")
def test_user_count_is_one_with_alone_client(socketio_client):
    assert 1 == get_online_player_count_from_client(socketio_client)


@pytest.mark.usefixtures("socketio_client_factory")
def test_user_count_decrements_after_disconnect(socketio_client_factory):
    client_one = socketio_client_factory.create()
    client_two = socketio_client_factory.create()
    assert 2 == get_online_player_count_from_client(client_one)
    assert 2 == get_online_player_count_from_client(client_two)

    client_two.disconnect()
    assert 1 == get_online_player_count_from_client(client_one)


def get_uid_from_websocket_connection_player_id_event(socketio_client):
    events = socketio_client.get_received()
    player_id_events = get_events_with_name(events, "connection-player-id")

    assert len(player_id_events) == 1

    player_id_event = player_id_events[0]

    assert len(player_id_event["args"]) == 1

    return player_id_event["args"][0]["uid"]


def get_online_player_count_from_client(socketio_client):
    events = socketio_client.get_received()
    online_user_events = get_events_with_name(events, "connection-info-update")

    latest_online_user_event = online_user_events[-1]

    online_users = latest_online_user_event["args"][0]["users"]

    return online_users


def get_events_with_name(events, name):
    return [event for event in events if event["name"] == name]
