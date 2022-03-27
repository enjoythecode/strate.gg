import functools
import time

import pytest
import redislite

from app import create_app
from app import socketio


@pytest.fixture
def test_redis():
    return redislite.Redis("/tmp/redis.db")


@pytest.fixture
def test_time_provider():
    class TestTimeProvider:
        def __init__(self, mocked_time=None):
            self.mocked_time = mocked_time
            # for debugging purposes; is the copy given to other fixtures the
            # same as the one given to the test itself? (yes)
            self.created_time = time.time()

        def set_mocked_time(self, new_time):
            self.mocked_time = new_time

        def get_mocked_time(self):
            assert self.mocked_time is not None, "Mocked time not set yet!"
            return self.mocked_time

        def time(self):  # matching the API of the built-in module 'time'
            return self.get_mocked_time()

    return TestTimeProvider()


@pytest.fixture
def app(test_redis, test_time_provider):

    test_app = create_app(test_redis, test_time_provider)
    test_app.config.update(
        {
            "TESTING": True,
        }
    )
    yield test_app


def get_https(client, *args, **kwargs):
    return client.get(
        *args, base_url="https://localhost", follow_redirects=True, **kwargs
    )


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def client_https(app):
    client = app.test_client()

    # monkey patch the test_client with a get method that defaults to the HTTPS scheme!
    get_https_augment = functools.partial(get_https, client)
    setattr(client, "get_https", get_https_augment)

    return client


@pytest.fixture
def socketio_client_factory(app):
    class SocketIO_Client_Factory:
        def create():

            client = app.test_client()
            # emulates the real socketio usage where we load index first
            # and then connect with socketio, and thus the server socketio
            # has access to our cookie!
            client.get("/", base_url="https://localhost", follow_redirects=True)

            return socketio.test_client(app, flask_test_client=client)

    return SocketIO_Client_Factory


@pytest.fixture
def socketio_client(socketio_client_factory):
    return socketio_client_factory.create()
