import pytest
from werkzeug.http import parse_cookie


@pytest.mark.usefixtures("client")
def test_index(client):
    response = client.get("/")

    assert_response_200(response)
    assert_response_is_index_html(response)


@pytest.mark.usefixtures("client")
def test_index_gives_cookies(client):
    response = client.get("/")

    session_cookie = get_session_cookie_from_response(response)

    assert session_cookie is not None


@pytest.mark.usefixtures("client")
def test_index_cookie_attributes(client):
    response = client.get("/")

    session_cookie = get_session_cookie_from_response(response)

    cookie_attrs = get_attributes_of_cookie(session_cookie)
    cookie_value = cookie_attrs["session"]

    assert "Secure" in cookie_attrs
    assert "HttpOnly" in cookie_attrs
    assert cookie_attrs["SameSite"] == "Lax"
    assert cookie_attrs["Path"] == "/"

    assert isinstance(cookie_value, str)
    assert len(cookie_value) > 0


@pytest.mark.usefixtures("client")
def test_same_cookie_across_requests(client):
    first_response = client.get("/")
    second_response = client.get("/")

    first_sess = get_session_value_from_response(first_response)
    second_sess = get_session_value_from_response(second_response)

    assert first_sess == second_sess


def assert_response_200(response):
    assert response.status == "200 OK"


def assert_response_is_index_html(response):
    assert b"<!doctype html>" in response.data


def get_session_cookie_from_response(response):
    cookies = response.headers.getlist("Set-Cookie")
    return next((cookie for cookie in cookies if "session" in cookie), None)


def get_session_value_from_response(response):
    session_cookie = get_session_cookie_from_response(response)
    attrs = get_attributes_of_cookie(session_cookie)
    return attrs["session"]


def get_attributes_of_cookie(cookie):
    return parse_cookie(cookie)
