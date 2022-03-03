import pytest
import redislite

from app import create_app


@pytest.fixture
def test_redis():
    return redislite.Redis("/tmp/redis.db")


@pytest.fixture
@pytest.mark.usefixtures("test_redis")
def app(test_redis):
    test_app = create_app(test_redis)
    test_app.config.update(
        {
            "TESTING": True,
        }
    )
    yield test_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()
