import pytest

expected_security_header_pairs = [
    ("Strict-Transport-Security", "max-age=31556926; includeSubDomains"),  # aka HSTS
    (
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' ws://localhost:3000;"
        + " style-src 'self' 'unsafe-inline'",
    ),
    ("X-Content-Type-Options", "nosniff"),
    ("X-Frame-Options", "SAMEORIGIN"),
    ("Referrer-Policy", "strict-origin-when-cross-origin"),
]


@pytest.mark.parametrize("header_key,header_val", expected_security_header_pairs)
def test_index_gives_cookies(client_https, header_key, header_val):
    response = client_https.get_https("/")

    assert header_val in get_header_from_response_by_name(response, header_key)


def test_http_requests_returns_status_code_302(client):
    response = client.get("/")
    assert response.status_code == 302


def test_http_requests_get_redirected_to_https(client):
    response = client.get("/", follow_redirects=True)
    assert len(response.history) == 1  # there was 1 redirect
    assert "https://localhost/" in get_header_from_response_by_name(
        response.history[0], "Location"
    )


def get_header_from_response_by_name(response, header):
    headers = response.headers.getlist(header)
    return headers
