import pytest


@pytest.mark.usefixtures("socketio_client")
def test_socketio_can_connect(socketio_client):
    assert socketio_client.is_connected()
