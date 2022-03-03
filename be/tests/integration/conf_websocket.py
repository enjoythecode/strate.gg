def assert_event_succesful(payload):

    assert "result" in payload
    assert payload["result"] == "success"


def assert_event_errored(payload):

    assert "result" in payload
    assert payload["result"] == "error"


def assert_event_includes_challenge_data(payload):
    assert "challenge" in payload

    challenge_data = payload["challenge"]

    assert "game_name" in challenge_data
    assert "players" in challenge_data
    assert len(challenge_data["players"]) == 1

    assert "state" in challenge_data

    board_data = challenge_data["state"]

    assert "turn" in board_data
