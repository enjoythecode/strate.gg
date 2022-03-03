import pytest


@pytest.mark.usefixtures("client")
def test_request_example(client):
    response = client.get("/")

    assert_response_200(response)
    assert_response_is_index_html(response)


def assert_response_200(response):
    assert response.status == "200 OK"


def assert_response_is_index_html(response):
    assert b"<!doctype html>" in response.data
