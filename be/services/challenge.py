from flask import g
from utils import generate_random_id

from py_logic.amazons_state import AmazonsState
from py_logic.mancala_state import MancalaState

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

GAME_STATE_CLASSES = {"amazons": AmazonsState, "mancala": MancalaState}
CHALLENGE_ID_LENGTH = 8


def _generate_cid():
    return generate_random_id(CHALLENGE_ID_LENGTH)


def _redis_key_cid(cid):
    return "challenge:" + cid


def _redis_key_challenge(challenge):
    return _redis_key_cid(challenge)


def _cid_exists(cid):
    return g.redis.exists(_redis_key_cid(cid))


def _challenge_exists(challenge):
    return _cid_exists(challenge["cid"])


def _challenge_set(challenge):
    # XXX: I should handle this kind of result checking in the redis service!
    result = g.redis.set(_redis_key_challenge(challenge), challenge)
    if result != "OK":
        pass
        # TODO: raise some kind of error here!


def create_challenge(game_name, game_config):

    if game_name not in GAME_STATE_CLASSES:
        # XXX: standardize error communication!
        return {"result": "error", "error": "Not a valid name."}

    game = GAME_STATE_CLASSES[game_name]

    if not game.is_valid_config(game_config):
        # XXX: standardize error communication!
        return {"result": "error", "error": "Invalid configuration."}

    game_state = game.create_from_config(game_config)

    cid = _generate_cid()
    while _cid_exists(cid):
        cid = _generate_cid()

    challenge_obj = {
        "game_name": game_name,
        "state": game_state.__repr__(),  # XXX: rename key to game_state
        "players": [],
        "moves": [],  # XXX: move to game
        "status": "WAITING_FOR_PLAYERS",
        "cid": cid,
        "game_end_override": None,
    }

    _challenge_set(challenge_obj)

    return challenge_obj
