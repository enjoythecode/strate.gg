import copy
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
    "player_won": Int. If a player won, this is the index of the player that won
        Otherwise, it is -1.
}

A ChallengeStatus is a string literal with self-explanatory names.
    WAITING_FOR_PLAYERS
    IN_PROGRESS
    OVER_NORMAL
    OVER_DISCONNECT
    OVER_TIME
"""


class TimeControl:
    def __init__(self, config=None, move_timestamps=None):
        self.config = config if config is not None else {}
        self.move_stamps = move_timestamps if move_timestamps is not None else []

    def as_dict(self):
        return {"time_config": self.config, "move_timestamps": self.move_stamps}

    @classmethod
    def from_dict(cls, data):
        obj = TimeControl(data["time_config"], data["move_timestamps"])
        return obj

    @classmethod
    def from_config(cls, config):
        if config is {}:
            return cls(config=None, move_timestamps=None)
        return cls(config=config, move_timestamps=None)

    def is_timed_challenge(self):
        return self.config != {}

    # xxx>><<????
    def calc_time_user_used_from_timestamps(stamps):  # helper for clock
        """calculates the total amount of time used for the user with the last stamp"""
        used_time = 0
        for i in range(len(stamps) - 1, 0, -2):
            used_time += stamps[i] - stamps[i - 1]

        return used_time

    def check_game_clock_OK(self):
        """checks the time for the player with the turn"""
        if not self.is_timed_challenge():
            return True

        current_time = current_app.time_provider.time()

        timestamps = self.move_stamps + [current_time]
        timeconfig_base = self.config["base_s"]
        timeconfig_increment = self.config["increment_s"]
        user_moves_with_increment_counted = (len(timestamps) - 2) // 2
        used_time = calc_time_user_used_from_timestamps(timestamps)
        total_increment_bonus = timeconfig_increment * user_moves_with_increment_counted

        game_clock_is_ok = timeconfig_base + total_increment_bonus > used_time
        return game_clock_is_ok

    def record_move_timestamp(self):
        self.move_stamps.append(current_app.time_provider.time())


class Challenge:
    def __init__(self, data):
        game = GAME_STATE_CLASSES[data["game_name"]]

        self.game_name = data["game_name"]
        self.state = game.from_dict(data["state"])
        self.players = copy.deepcopy(data["players"])
        self.moves = data["moves"]
        self.status = data["status"]
        self.cid = data["cid"]
        self.player_won = data["player_won"]
        self.time_control = TimeControl.from_dict(data["time_control"])

    @classmethod
    def create_new(cls, game_name, game_config, cid=None, time_config=None):
        assert game_name in GAME_STATE_CLASSES, "bad game name"
        game = GAME_STATE_CLASSES[game_name]
        assert game.is_valid_config(game_config), "Game configuration is invalid"
        game_state = game.create_from_config(game_config)

        cid = cid if cid else _generate_unique_cid()
        data = {
            "game_name": game_name,
            "state": game_state.as_dict(),
            "players": [],
            "moves": [],
            "status": "WAITING_FOR_PLAYERS",
            "cid": cid,
            "player_won": -1,
            "time_control": TimeControl.from_config(time_config).as_dict(),
        }

        return cls(data)

    @classmethod
    def from_dict(cls, data):
        return cls(data)

    @classmethod
    def from_database(cls, cid):
        data = _get_challenge_by_cid(cid)
        return cls.from_dict(data)

    def as_dict(self):
        return {
            "game_name": self.game_name,
            "state": self.state.as_dict(),
            "players": self.players,
            "moves": self.moves,
            "status": self.status,
            "cid": self.cid,
            "player_won": self.player_won,
            "time_control": self.time_control.as_dict(),
        }

    def get_cid(self):
        return self.cid

    def user_can_be_added(self, uid):
        if len(self.players) == self.state.get_max_no_players():
            return False
        if uid in self.players:

            return False
        return True

    def player_spots_are_full(self):
        return len(self.players) == self.state.get_max_no_players()

    def add_player(self, player):
        self.players.append(player)
        if self.player_spots_are_full():
            self.change_status_to_in_progress()

    def change_status_to_in_progress(self):
        self.status = "IN_PROGRESS"

    def is_in_progress(self):
        return self.status == "IN_PROGRESS"

    def default_on_time(self):
        current_player = self.state.turn

        self.status = "OVER_TIME"
        # set the remaining player as the winner
        self.player_won = (current_player + 1) % 2

    def check_game_clock_OK(self):
        return self.time_control.check_game_clock_OK()

    def user_is_a_player(self, uid):
        return uid in self.players

    def user_may_make_move(self, uid):
        return self.state.turn == self.players.index(uid)

    def make_move(self, move):

        self.state.make_move(move)
        self.moves.append(move)
        self.time_control.record_move_timestamp()

        if self.has_no_winner():  # game not terminated due to other reasons
            self.player_won = self.state.check_game_end()

    def has_no_winner(self):
        return self.player_won == -1


CHALLENGE_ID_LENGTH = 8


def _generate_cid():  # helper
    return generate_random_id(CHALLENGE_ID_LENGTH)


def socket_room_name_from_cid(cid):  # helper, socket
    return "challenge" + "_" + cid


def socket_room_name_from_challenge(challenge):  # helper, socket
    return socket_room_name_from_cid(challenge["cid"])


def _get_redis_key_for_challenge_from_cid(cid):  # helper, database
    return "challenge:" + cid


# TODO: shorter names PLEASE
def _get_redis_key_for_challenge_from_challenge(challenge):  # helper, database
    if isinstance(challenge, Challenge):
        return _get_redis_key_for_challenge_from_cid(challenge.get_cid())
    return _get_redis_key_for_challenge_from_cid(challenge["cid"])


def _cid_exists(cid):  # helper, database
    return current_app.redis.exists(_get_redis_key_for_challenge_from_cid(cid))


def _generate_unique_cid():  # helper
    cid = _generate_cid()
    while _cid_exists(cid):
        cid = _generate_cid()

    return cid


def _challenge_set(challenge):  # helper, database
    # XXX: I should handle this kind of result checking in the redis service!
    # TODO: that redis service should have proper error checking
    current_app.redis.set(
        _get_redis_key_for_challenge_from_challenge(challenge), json.dumps(challenge)
    )


def redis_key_exists(key):
    return current_app.redis.exists(key)


def _get_challenge_by_cid(cid):  # helper, database
    key = _get_redis_key_for_challenge_from_cid(cid)
    assert redis_key_exists(key)
    response = current_app.redis.get(key)
    return json.loads(response)


def send_challenge_update_to_clients(challenge):  # action
    payload = {"result": "success", "challenge": challenge}
    target_room = socket_room_name_from_challenge(challenge)
    emit("challenge-update", payload, to=target_room)


def process_disconnect_from_user(uid):  # action

    cids_to_terminate = user_service.get_realtime_challenges_of_user(uid)
    for cid in cids_to_terminate:
        if _cid_exists(cid):
            default_player_due_to_disconnect(cid, uid)
    # TODO unsubscribe the user from the rooms to free up resources!


def default_player_due_to_disconnect(cid, uid):  # action
    # TODO: also handle dangling games here?

    challenge = _get_challenge_by_cid(cid)
    if challenge["status"] == "IN_PROGRESS":
        challenge["status"] = "OVER_DISCONNECT"

        challenge["player_won"] = (
            challenge["players"].index(uid) + 1
        ) % 2  # set the remaining player as the winner

        _challenge_set(challenge)

        send_challenge_update_to_clients(challenge)


# TIME CONTROL
def calc_time_user_used_from_timestamps(stamps):  # helper for clock
    # calculates the total amount of time used for the user with the last stamp
    used_time = 0
    for i in range(len(stamps) - 1, 0, -2):
        used_time += stamps[i] - stamps[i - 1]

    return used_time


# API METHODS
def create_challenge(game_name, game_config, time_config=None):
    challenge = Challenge.create_new(
        game_name=game_name, game_config=game_config, time_config=time_config
    )
    challenge_obj = challenge.as_dict()
    _challenge_set(challenge_obj)
    return challenge_obj


def add_player_to_challenge(uid, cid):

    challenge = Challenge.from_database(cid)
    assert challenge.user_can_be_added(uid)

    challenge.add_player(uid)
    user_service.add_realtimechallenge_to_user(cid)

    challenge_obj = challenge.as_dict()
    _challenge_set(challenge_obj)
    send_challenge_update_to_clients(challenge_obj)
    return challenge_obj


def handle_clock_check(cid):  # action, API

    challenge = Challenge.from_database(cid)

    assert challenge.is_in_progress(), "Game is not in progress"
    assert not challenge.check_game_clock_OK(), "clock is OK"

    challenge.default_on_time()

    challenge_obj = challenge.as_dict()

    _challenge_set(challenge_obj)
    send_challenge_update_to_clients(challenge_obj)

    return {"result": "success"}


def handle_move(cid, move):
    uid = user_service.get_uid_of_session_holder()

    challenge = Challenge.from_database(cid)
    assert challenge.is_in_progress(), "Game is not in progress"
    assert challenge.state.is_valid_move(move), "Invalid move"
    assert challenge.user_is_a_player(uid), "You are not a player"
    assert challenge.user_may_make_move(uid), "Not your turn"

    if challenge.check_game_clock_OK():
        challenge.make_move(move)
    else:
        challenge.default_on_time()

    challenge_obj = challenge.as_dict()

    _challenge_set(challenge_obj)
    send_challenge_update_to_clients(challenge_obj)

    return {"result": "success"}
