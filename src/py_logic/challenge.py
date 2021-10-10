from py_logic.amazons_state import AmazonsState
import enum

class ChallengeStatus(enum.Enum):
    WAITING_FOR_PLAYERS = 1
    IN_PROGRESS = 2
    OVER_NORMAL = 3
    OVER_DISCONNECT = 4
    OVER_TIME = 5

game_classes = {
    "amazons": AmazonsState
}

class Challenge:
    """
    Represent a challenge of an N-player game
    """

    def __init__(self):
        self.game_name = None
        self.state = None
        self.players = None
        self.moves = None
        self.status = None
        self.cid = None
        
    def initialize_challenge(self, game_name, cid, config):
        if not game_name in game_classes:
            return {"result": "error", "error": "Not a valid name."}
        
        game = game_classes[game_name]

        if not game.is_valid_config(config):
            return {"result": "error", "error": "Invalid configuration."}

        self.game_name = game_name
        self.state = game.create_from_config(config)
        self.players = []
        self.moves = []
        self.status = ChallengeStatus.WAITING_FOR_PLAYERS
        self.cid = cid

        response = {
            "result" : "success",
            "game_name": game_name,
            "cid": cid,
            "players": self.players,
            "status": self.status.name,
            "game": self.state.game_data()
        }
        return response

    def join_player(self, user):
        if len(self.players) < self.state.get_max_no_players():
            self.players.append(user.sid)
            user.games_playing.append(self.cid)
        else:
            user.games_observing.append(self.cid)

        if len(self.players) == self.state.get_max_no_players():
            self.status = ChallengeStatus.IN_PROGRESS

        response = {
            "game": self.state.game_data(),
            "players": self.players,
            "status": self.status.name,
            "cid": self.cid
        }
        return response

    def make_move(self, move, user):
        if not self.state.is_valid_move(move):
            return {"result": "error", "error": "invalid move"}

        if user.sid in self.players and self.state.playerJustMoved != self.players.index(user.sid) + 1:
            self.state.make_move(move)
        else:
            return {"result": "error", "error": "not your turn"}

        response = {
            "cid": self.cid,
            "result" : "success",
            "move": move,
            "status": self.status.name
        }
        return response

    def get_socket_room_name(self):
        return self.game_name + "_" + self.cid

    def handle_disconnect(self, user):
        self.status = ChallengeStatus.OVER_DISCONNECT

        response = {
            "cid": self.cid,
            "status": self.status.name
        }

        return response