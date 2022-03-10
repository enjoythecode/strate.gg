def emit_succesful_amazons_create_challenge(io_client):
    payload = io_client.emit(
        "challenge-create",
        {"game_name": "amazons", "game_config": {"size": 10, "variation": 0}},
        callback=True,
    )
    return payload


def emit_join_challenge_with_cid(io_client, cid):
    response = io_client.emit("challenge-join", {"cid": cid}, callback=True)
    return response


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
