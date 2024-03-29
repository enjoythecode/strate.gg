import re

import pytest
from werkzeug.http import parse_cookie


def test_index(client_https):
    response = client_https.get_https("/")

    assert_response_200(response)
    assert_response_is_index_html(response)


def test_static_js_bundle_route(client_https):
    index_response = client_https.get_https("/")
    assert_response_200(index_response)

    index_html_text = index_response.data.decode("utf-8")
    js_matcher = re.compile(r"/static/js/main\.[a-zA-Z0-9]+\.js")
    js_path = js_matcher.search(index_html_text).group()
    assert js_path is not None

    js_bundle_response = client_https.get_https(js_path)
    assert_response_200(js_bundle_response)
    assert_response_is_bundle_js(js_bundle_response)


def test_index_gives_cookies(client_https):
    response = client_https.get_https("/")

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


@pytest.mark.usefixtures("client")
def test_forged_cookie_is_rejected(client):
    # TODO Test that this test would actually fail with wrong implementation
    forged_cookie_value = "I_AM_A_HACKER_TRYING_TO_FORGE_THIS_COOKIE"

    first_response = client.get("/")
    client.set_cookie("localhost", "session", forged_cookie_value)
    second_response = client.get("/")

    first_sess = get_session_value_from_response(first_response)
    second_sess = get_session_value_from_response(second_response)

    assert first_sess != second_sess
    assert second_sess != forged_cookie_value


def assert_response_200(response):
    assert response.status_code == 200


def assert_response_is_index_html(response):
    assert b"<!doctype html>" in response.data


def assert_response_is_bundle_js(response):
    assert b"!function(){" in response.data


def get_session_cookie_from_response(response):
    cookies = response.headers.getlist("Set-Cookie")
    return next((cookie for cookie in cookies if "session" in cookie), None)


def get_session_value_from_response(response):
    session_cookie = get_session_cookie_from_response(response)
    attrs = get_attributes_of_cookie(session_cookie)
    return attrs["session"]


def get_attributes_of_cookie(cookie):
    return parse_cookie(cookie)
