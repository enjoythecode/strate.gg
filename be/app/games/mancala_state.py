import copy

from app.games.game_state import GameState

starting_board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]

# ---- INDICES MAPPING TO BOARD ---- #
# P2:  13, 12, 11, 10, 9, 8, 7
# P1:       0,  1,  2, 3, 4, 5, 6,


BANKS = [6, 13]  # bank indices


class MancalaState(GameState):  # pragma: no cover
    """
    MancalaState is serialized in JSON as such:
    {
        "turn": Integer. Current player with the turn, 0-indexed. Ex: white to move ->
            "turn" == 0, black to move -> "turn" == 1.
        "board": List of Integers. Board[x] is the number of stones on that cell.
            ---- INDICES MAPPING TO BOARD ----
             P2:  13, 12, 11, 10, 9, 8, 7
             P1:       0,  1,  2, 3, 4, 5, 6,
             (6 is P1 bank, 13 is P2 bank)
        "number_of_turns": Integer. Number of turns taken in the game so far.
    }
    """

    def __init__(self, board, turn=0):
        self.turn = 0
        self.board = copy.deepcopy(board)
        self.number_of_turns = 0

    @classmethod
    def is_valid_config(self, config):
        return config == {}

    @classmethod
    def create_from_config(self, config):
        return MancalaState(starting_board)

    @classmethod
    def get_max_no_players(self):
        return 2

    def __repr__(self):
        """
        Returns relevant game data as a dictionary.
        __repr__ is meant for robots (not humans!)
        Intended to be passed onto a client for consumption or storage
        (ie JSON in Redis.)
        """
        return {
            "board": self.board,
            "turn": self.turn,
            "turns_taken": self.number_of_turns,
        }

    def clone(self):
        """Create a deep clone of this game state."""
        return MancalaState(copy.deepcopy(self.board), self.turn)

    def make_move(self, move):
        ptr = move["pit"] + self.turn * 7

        seeds = self.board[ptr]
        this_plyr = self.turn
        next_plyr = (this_plyr + 1) % 2

        self.board[ptr] = 0
        while seeds:
            ptr += 1
            ptr = ptr % 14  # wrap around the board!

            if ptr == BANKS[next_plyr]:  # rival bank
                continue
            else:
                self.board[ptr] += 1
                seeds -= 1

        # check for capture
        # (ruleset: capture happens when landing on empty pit on friendly side)
        if 0 <= ptr - 7 * self.turn <= 5 and self.board[ptr] == 1:
            capture = 0
            for i in [ptr, 12 - ptr]:
                print("capture i", i)
                capture += self.board[i]
                self.board[i] = 0
            self.board[BANKS[self.turn]] += capture

        # advance the round to the next player if landed outside self-bank.
        if not ptr == BANKS[self.turn]:
            self.turn = next_plyr

        self.number_of_turns += 1

        # check for game end
        game_end_sweep = -1

        if sum(self.board[0:6]) == 0:
            game_end_sweep = 0
        elif sum(self.board[7:13]) == 0:
            game_end_sweep = 1

        if game_end_sweep != -1:
            self.board[6 + game_end_sweep * 7] += sum(self.board[0:6]) + sum(
                self.board[7:13]
            )

    def is_valid_move(self, move):
        if "pit" not in move:
            return False

        # it should be a friendly pit
        if not (0 <= move["pit"] <= 5):
            return False

        # pit must not be empty
        if self.board[move["pit"] + 7 * self.turn] == 0:
            return False

        return True

    def check_game_end(self):
        if sum(self.board[0:6]) == 0 or sum(self.board[7:13]) == 0:
            if self.board[6] > self.board[13]:
                return 1
            elif self.board[6] < self.board[13]:
                return 2
            else:
                return -2  # draw!

        return 0  # going on

    def __str__(self):  # string representation of the board from the perspective of P0
        return str(self.board) + "turn" + str(self.turn)
