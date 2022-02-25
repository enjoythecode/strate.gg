import copy

from py_logic import game_state

starting_board_10x0 = [
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
]

starting_board_6x0 = [
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
]

starting_board_4x0 = [[0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, 0]]


def prettify_board_character(n):
    """
    Convenience method that maps internal number representations to strings for humans
    """
    return ".WBX"[n]


class AmazonsState(game_state.GameState):
    """
    Holds the state of the Game of Amazons (board etc.).
    Players are numbered 1 and 2.
    Assumes a square board.


    An AmazonsState is serialized in JSON as such:
    {
        "turn": Integer. Current player with the turn, 0-indexed. Ex: white to move ->
            "turn" == 0, black to move -> "turn" == 1.
        "board": List of List of Integers. Board[x][y] is the cell at row (from top) x,
            col (from left) y. 0 is blank, 1 is white queen, 2 is black queen, 3 is
            cell that was burned off.
        "game_size": Integer. Side length of the board. Most likely, 10.
        "number_of_turns": Integer. Number of turns taken in the game so far.
    }

    """

    def __init__(self, board, turn=0):
        self.turn = turn
        self.board = copy.deepcopy(board)
        self.game_size = len(board)
        self.number_of_turns = 0

    @classmethod
    def is_valid_config(self, config):
        if "size" in config and config["size"]:
            if not config["size"] in [4, 6, 10]:
                return False

        if "variation" in config and config["variation"]:
            if not config["variation"] in [0]:
                return False

        return True

    @classmethod
    def create_from_config(self, config):

        print(config)

        b = (config["size"], config["variation"])
        print(b)
        if b == (10, 0):
            starting_board = starting_board_10x0
        elif b == (6, 0):
            starting_board = starting_board_6x0
        elif b == (4, 0):
            starting_board = starting_board_4x0

        return AmazonsState(starting_board)

    @classmethod
    def get_max_no_players(self):
        return 2

    def game_data(self):
        """
        Returns relevant game data in a dictionary.
        Intended to be passed onto a client for consumption
        """
        return {
            "board": self.board,
            "game_size": self.game_size,
            "turn": self.turn,
            "turns_taken": self.number_of_turns,
        }

    def clone(self):
        """Create a deep clone of this game state."""
        st = AmazonsState(copy.deepcopy(self.board), self.turn)
        return st

    def make_move(self, move):
        fr = move["from"]
        to = move["to"]
        sh = move["shoot"]

        self.board[int(fr[0])][int(fr[1])] = 0
        self.board[int(to[0])][int(to[1])] = self.turn + 1
        self.board[int(sh[0])][int(sh[1])] = 3

        self.turn = (self.turn + 1) % 2

        self.number_of_turns += 1

    def is_valid_move(self, move):
        move_arr = [v for v in move.values()]
        return move_arr in self.get_possible_moves()

    def count_possible_moves(self, player=None):
        """Get # of possible moves from this state."""
        out = 0
        if player is None:
            player = self.turn + 1

        queen_moves = self.get_possible_queen_moves(player)

        for q in queen_moves:
            out += self.count_possible_shots_from_queen(q[1], q[0])

        return out

    def get_possible_moves(self, player=None):
        """
        Returns a list of all possible moves from this state.
        ---
        Arguments:
            player: [1, 2]. The player to get the theoric possible moves from. Does not
            take into account turns.
                Defaults to player with the turn.
        ---
        Returns:
            out: list of possible moves of the given player.

        """
        out = []
        if player is None:
            player = self.turn + 1

        queen_moves = self.get_possible_queen_moves(player)
        for q in queen_moves:
            out.extend(
                [
                    [q[0], q[1], s]
                    for s in self.get_possible_shots_from_queen(q[1], q[0])
                ]
            )
        return out

    def get_possible_queen_moves(self, player=None):
        out = []
        if player is None:
            player = self.turn + 1
        for q_x in range(self.game_size):
            for q_y in range(self.game_size):
                if self.board[q_x][q_y] == player:
                    q = str(q_x) + str(q_y)
                    out.extend([[q, x] for x in self.get_sliding_squares(q)])

        return out

    def count_possible_queen_moves(self, player=None):
        if player is None:
            player = self.turn + 1
        out = 0

        for q_x in range(self.game_size):
            for q_y in range(self.game_size):
                if self.board[q_x][q_y] == player:
                    q = str(q_x) + str(q_y)
                    out += self.count_sliding_squares(q)

        return out

    def get_possible_shots_from_queen(self, source, ignore):
        return self.get_sliding_squares(source, ignore, True)

    def count_possible_shots_from_queen(self, source, ignore):
        return self.count_sliding_squares(source, ignore, True)

    def get_sliding_squares(self, cell_from, ignore=None, include_ignore=False):
        """
        Helper function that returns the sliding move squares from a given square in
        the given board state.

        This is used by most other move functions since all movement and shooting in
        Amazons is the same 8-direction sliding attack
        """
        out = []
        from_x = int(cell_from[0])
        from_y = int(cell_from[1])
        ignore_x = int(ignore[0]) if ignore is not None else -1
        ignore_y = int(ignore[1]) if ignore is not None else -1

        # neat!
        deltas = [  # incremental changes to x and y to move in 8 directions
            (-1, 1),
            (0, 1),
            (1, 1),
            (-1, 0),
            (1, 0),
            (-1, -1),
            (0, -1),
            (1, -1),
        ]

        for dx, dy in deltas:
            x, y = from_x, from_y
            while 0 <= x + dx < self.game_size and 0 <= y + dy < self.game_size:
                x += dx
                y += dy
                if self.board[x][y] != 0:
                    if ignore_x == x and ignore_y == y:
                        if include_ignore:
                            out.append(str(x) + str(y))
                        continue
                    else:
                        break
                else:
                    out.append(str(x) + str(y))
        return out

    def count_sliding_squares(self, cell_from, ignore=None, include_ignore=False):
        """
        Different from len(get_sliding_squares) because natively counting is faster
        than adding all the possible moves to a list and counting it.
        """
        out = 0
        from_x = int(cell_from[0])
        from_y = int(cell_from[1])
        ignore_x = int(ignore[0]) if ignore is not None else -1
        ignore_y = int(ignore[1]) if ignore is not None else -1

        # neat!
        deltas = [  # incremental changes to x and y to move in 8 directions
            (-1, 1),
            (0, 1),
            (1, 1),
            (-1, 0),
            (1, 0),
            (-1, -1),
            (0, -1),
            (1, -1),
        ]

        for dx, dy in deltas:
            x, y = from_x, from_y
            while 0 <= x + dx < self.game_size and 0 <= y + dy < self.game_size:
                x += dx
                y += dy
                if self.board[x][y] != 0:
                    if ignore_x == x and ignore_y == y:
                        if include_ignore:
                            out += 1
                        continue
                    else:
                        break
                else:
                    out += 1
        return out

    def is_game_going_on(self):
        return bool(self.count_possible_queen_moves())

    def check_game_end(self):
        p1 = self.count_possible_queen_moves(1)
        p2 = self.count_possible_queen_moves(2)
        if p1 == 0 and p2 == 0:
            return (self.turn - 1) % 2  # player who just moved wins
        elif p1 == 0:  # player 2 won
            return 2
        elif p2 == 0:  # player 1 won
            return 1
        else:  # game going on
            return 0

    def __repr__(self):
        """Returns a string representation of the board."""
        return "\n".join(
            [" ".join([prettify_board_character(c) for c in x]) for x in self.board]
        )


# small, informal tests
if __name__ == "__main__":
    g = AmazonsState.create_from_size(10, 0)
    print(g.count_possible_moves())
