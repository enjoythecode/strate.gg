import json

from flask import current_app
from flask_socketio import emit

from app.games import GAME_STATE_CLASSES
from app.users import user_service
from app.utils import generate_random_id

"""
Defines functions to work with challenges.

A challenge is an instance of a multiplayer board game between any 2+ players. It
can be created, joined, observed. The board game that this challenge involved can
be issued moves. The challenge may end on terms of gameplay rules, forfeit, or on
time control.

A challenge is represented as a Dictionary with the following structure:
{
    "game_name": String. Representing the type of game this challenge is playing
        ex: "amazons" or "mancala",
    "state": An Object that the individual game has serialized according to its
        own representation.
    "players": List of String. The uids of the players, where players[0] is the
        first player, players[1] is the second, etc.
    "moves": List of String. A list of moves in the game in chronological order.
        The encode/decoding to string is handled by the individual game code.
    "status": String (as defined in ChallengeStatus). Representing the game status
        (waiting for players, in progress, over, etc.)
    "cid": String. ID assigned to the game.
    "game_end_override": Int or None. If a player won due to externalities (time up
        for opponent, opponent disconnect, this is the index of the player that won)
        Otherwise, it is None.
}

A ChallengeStatus is a string literal with self-explanatory names.
    WAITING_FOR_PLAYERS
    IN_PROGRESS
    OVER_NORMAL
    OVER_DISCONNECT
    OVER_TIME
"""

CHALLENGE_ID_LENGTH = 8


def _generate_cid():
    return generate_random_id(CHALLENGE_ID_LENGTH)


def socket_room_name_from_cid(cid):
    return "challenge" + "_" + cid


def socket_room_name_from_challenge(challenge):
    return socket_room_name_from_cid(challenge["cid"])


def _get_redis_key_for_challenge_from_cid(cid):
    return "challenge:" + cid


# TODO: shorter names PLEASE
def _get_redis_key_for_challenge_from_challenge(challenge):
    return _get_redis_key_for_challenge_from_cid(challenge["cid"])


def _cid_exists(cid):
    return current_app.redis.exists(_get_redis_key_for_challenge_from_cid(cid))


def _challenge_exists(challenge):
    return _cid_exists(challenge["cid"])


def _generate_unique_cid():
    cid = _generate_cid()
    while _cid_exists(cid):
        cid = _generate_cid()

    return cid


def _challenge_set(challenge):
    # XXX: I should handle this kind of result checking in the redis service!
    result = current_app.redis.set(
        _get_redis_key_for_challenge_from_challenge(challenge), json.dumps(challenge)
    )

    # TODO: proper error checking, please!
    if result != "OK":
        pass


def _get_challenge_by_cid(cid):
    key = _get_redis_key_for_challenge_from_cid(cid)
    response = current_app.redis.get(key)
    return json.loads(response)


def create_challenge(game_name, game_config):

    uid = user_service.get_uid_of_session_holder()

    if game_name not in GAME_STATE_CLASSES:
        # XXX: standardize error communication!
        raise BaseException

    game = GAME_STATE_CLASSES[game_name]

    if not game.is_valid_config(game_config):
        raise BaseException

    game_state = game.create_from_config(game_config)

    cid = _generate_unique_cid()

    challenge_obj = {
        "game_name": game_name,
        "state": game_state.__repr__(),  # XXX: rename key to game_state
        "players": [uid],
        "moves": [],  # XXX: move to game
        "status": "WAITING_FOR_PLAYERS",
        "cid": cid,
        "game_end_override": None,
    }

    _challenge_set(challenge_obj)
    return challenge_obj


def send_challenge_update_to_clients(challenge):
    payload = {"result": "success", "challenge": challenge}
    target_room = socket_room_name_from_challenge(challenge)
    emit("challenge-update", payload, to=target_room)


def player_can_join_challenge(uid, challenge):

    return (
        len(challenge["players"])
        # XXX: smellyyy!!!
        < GAME_STATE_CLASSES[challenge["game_name"]].get_max_no_players()
        and uid not in challenge["players"]
        and challenge["status"] == "WAITING_FOR_PLAYERS"
    )


def add_player_to_challenge(uid, cid):

    challenge = _get_challenge_by_cid(cid)

    if not _cid_exists(cid):
        print("Error!")
        return {"result": "error", "error": "Challenge not found"}  # XXX: idk

    if not player_can_join_challenge(uid, challenge):
        return {"result": "error", "error": "This challenge can't be joined"}

    challenge["players"].append(uid)
    user_service.add_realtimechallenge_to_user(cid)

    if (
        len(challenge["players"])
        # XXX: smellyyy!!!. change with "challenge_players_is_full"
        == GAME_STATE_CLASSES[challenge["game_name"]].get_max_no_players()
    ):
        challenge["status"] = "IN_PROGRESS"

    _challenge_set(challenge)

    send_challenge_update_to_clients(challenge)


def process_disconnect_from_user(uid):

    cids_to_terminate = user_service.get_realtime_challenges_of_user(uid)
    for cid in cids_to_terminate:
        if _cid_exists(cid):
            default_player_due_to_disconnect(cid, uid)
    # TODO unsubscribe the user from the rooms to free up resources!


def get_game_end(challenge):
    if challenge["game_end_override"]:
        return challenge["game_end_override"]
    # TODO: likely broken
    game = GAME_STATE_CLASSES[challenge["game_name"]].init_from_repr(challenge["state"])
    return game.check_game_end()


def default_player_due_to_disconnect(cid, uid):

    # TODO: also handle dangling games here?

    challenge = _get_challenge_by_cid(cid)
    if challenge["status"] == "IN_PROGRESS":
        challenge["status"] = "OVER_DISCONNECT"

        challenge["game_end_override"] = (
            (challenge["players"].index(uid) + 1) % 2
        ) + 1  # set the remaining player as the winner

        _challenge_set(challenge)

        send_challenge_update_to_clients(challenge)


def handle_move(cid, move):
    challenge = _get_challenge_by_cid(cid)

    if not challenge["status"] == "IN_PROGRESS":
        return {"result": "error", "error": "game is not in progress"}

    # xxx instantiating these classes are tech debt!
    game = GAME_STATE_CLASSES[challenge["game_name"]].init_from_repr(challenge["state"])

    if not game.is_valid_move(move):
        return {"result": "error", "error": "invalid move"}

    uid = user_service.get_uid_of_session_holder()
    if uid in challenge["players"] and game.turn == challenge["players"].index(uid):
        game.make_move(move)

    else:
        return {"result": "error", "error": "not your turn"}

    # XXX: moves does not get added. it needs to be moved to the state class either way!

    challenge["state"] = game.__repr__()
    challenge["game_end"] = get_game_end(challenge)

    _challenge_set(challenge)
    send_challenge_update_to_clients(challenge)
