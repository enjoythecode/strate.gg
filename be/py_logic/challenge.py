import enum

from flask import session

from py_logic.amazons_state import AmazonsState
from py_logic.mancala_state import MancalaState

# style will be improved with the factory system
SESSION_KEYFOR_GAMESPLAYING = "games_playing"


class ChallengeStatus(enum.Enum):
    WAITING_FOR_PLAYERS = enum.auto()
    IN_PROGRESS = enum.auto()
    OVER_NORMAL = enum.auto()
    OVER_DISCONNECT = enum.auto()
    OVER_TIME = enum.auto()


game_classes = {"amazons": AmazonsState, "mancala": MancalaState}


class Challenge:
    """
    Represent a challenge of an N-player game

    A Challenge is serialized in JSON as such:
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
    """

    def __init__(self):
        self.game_name = None
        self.state = None
        self.players = None
        self.moves = None
        self.status = None
        self.cid = None
        # if game ends for a non-gameplay reason (resign, disconnect),
        # this field will be populated.
        self.game_end_override = None

    def initialize_challenge(self, game_name, cid, config):
        if game_name not in game_classes:
            return {"result": "error", "error": "Not a valid name."}

        game = game_classes[game_name]

        if not game.is_valid_config(config):
            return {"result": "error", "error": "Invalid configuration."}

        self.game_name = game_name
        self.state = game.create_from_config(config)
        self.state.challenge = self
        self.players = []
        self.moves = []
        self.status = ChallengeStatus.WAITING_FOR_PLAYERS
        self.cid = cid
        self.config = config

        response = {
            "result": "success",
            "game_name": game_name,
            "cid": cid,
            "players": self.players,
            "status": self.status.name,
            "game": self.state.game_data(),
            "config": self.config,
        }
        return response

    def join_player(self, uid):
        if (
            len(self.players) < self.state.get_max_no_players()
            and uid not in self.players
        ):
            if not self.status == ChallengeStatus.WAITING_FOR_PLAYERS:
                return {"result": "error", "error": "Game is not accepting players!"}
            self.players.append(uid)

            if "games_playing" in session and session["games_playing"]:
                session["games_playing"].append(self.cid)
            else:
                session["games_playing"] = [self.cid]

            session.modified = True  # TODO is this necessary?

            print("\nGAMES PLAYING:", uid, session[SESSION_KEYFOR_GAMESPLAYING])
        else:
            if "games_observing" in session and session["games_observing"]:
                session["games_observing"].append(self.cid)
            else:
                session["games_observing"] = [self.cid]

            session.modified = True  # TODO is this necessary?

        if len(self.players) == self.state.get_max_no_players():
            self.status = ChallengeStatus.IN_PROGRESS

        response = {
            "game": self.state.game_data(),
            "players": self.players,
            "status": self.status.name,
            "cid": self.cid,
            "config": self.config,
            "game_name": self.game_name,
            "result": "success",
        }
        return response

    def make_move(self, move, uid):
        if not self.status == ChallengeStatus.IN_PROGRESS:
            return {"result": "error", "error": "game is not in progress"}

        if not self.state.is_valid_move(move):
            return {"result": "error", "error": "invalid move"}

        if uid in self.players and self.state.turn == self.players.index(uid):
            self.state.make_move(move)
            game_end = self.check_game_end()
        else:
            return {"result": "error", "error": "not your turn"}

        response = {
            "cid": self.cid,
            "result": "success",
            "move": move,
            "status": self.status.name,
            "game_end": game_end,
        }
        return response

    def get_socket_room_name(self):
        return self.game_name + "_" + self.cid

    def handle_disconnect(self, uid):
        self.status = ChallengeStatus.OVER_DISCONNECT

        self.game_end_override = (
            (self.players.index(uid) + 1) % 2
        ) + 1  # set the remaining player as the winner

        response = {
            "cid": self.cid,
            "status": self.status.name,
            "game_end": self.check_game_end(),
        }

        return response

    def check_game_end(self):
        if self.game_end_override:
            return self.game_end_override
        else:
            return self.state.check_game_end()
