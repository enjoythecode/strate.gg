from amazons_state import AmazonsState
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

    def __init__(self, game_name, gid, config):
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
        self.gid = gid

        response = {
            "result" : "success",
            "gid": gid
        }
        return response

    def join_player(self, user):
        if len(self.players) < self.state.get_max_no_players():
            self.players.append(user.sid)
            user.games_playing.append(self.gid)
        else:
            user.games_observing.append(self.gid)

        if len(self.players) == self.state.max_no_players():
            self.status = ChallengeStatus.IN_PROGRESS

        response = {
            "game": self.board.game_data(),
            "players": self.players,
            "status": self.status.name
        }

    def make_move(self, move):
        if not self.state.is_valid_move(move):
            return {"result": "error", "error": "invalid move"}
        self.state.make_move(move)

        response = {
            "result" : "success",
            "move": move,
            "status": self.status.name
        }
        return response

    def get_socket_room_name(self):
        return self.game_name + "_" + self.cid

    def handle_disconnect(self):
        self.status = ChallengeStatus.OVER_DISCONNECT

        response = {
            "status": self.status.name
        }

        return response