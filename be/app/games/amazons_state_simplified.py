import copy

starting_board = [
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


class AmazonsState:
    """
    Holds the state of the Game of Amazons (board etc.).
    Players are numbered 1 and 2.
    Assumes a square board.
    """

    def __init__(self):
        self.turn = 0
        self.board = copy.deepcopy(starting_board)
        self.board_size = 10
        self.number_of_turns = 0

    def generate_legal_moves(self, player=None):
        player = self.turn + 1 if player is None else player

        for queen, move_to in self.generate_legal_queen_movements(player):
            for shoot in self.generate_sliding_squares(cell_from=move_to, ignore=queen):
                yield ({"from": queen, "to": move_to, "shoot": shoot})

    def generate_sliding_squares(self, cell_from, ignore=None):
        """
        Helper function that returns the sliding move squares from a given square in
        the given board state.

        This is used by most other move functions since all movement and shooting in
        Amazons is the same 8-direction sliding movement with the same checks
        """
        from_x = int(cell_from[0])
        from_y = int(cell_from[1])
        ignore_x = int(ignore[0]) if ignore is not None else -1
        ignore_y = int(ignore[1]) if ignore is not None else -1

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

            while 0 <= x + dx < self.board_size and 0 <= y + dy < self.board_size:
                x += dx
                y += dy

                ignore_blocking_cell = ignore_x == x and ignore_y == y
                if self.board[x][y] != 0 and not ignore_blocking_cell:
                    break
                yield str(x) + str(y)

    def is_valid_move(self, move):
        return move in list(self.generate_legal_moves())

    def count_legal_queen_movements(self, player=None):
        # avoid putting the entire list into memory, instead, iterate!
        count = 0
        for _ in self.generate_legal_queen_movements(player):
            count += 1
        return count

    def generate_legal_queen_movements(self, player=None):
        player = self.turn + 1 if player is None else player

        for q_x in range(self.board_size):
            for q_y in range(self.board_size):
                if self.board[q_x][q_y] == player:
                    queen = str(q_x) + str(q_y)
                    for move in self.generate_sliding_squares(cell_from=queen):
                        yield (queen, move)

    def check_game_end(self):
        p1 = self.count_legal_queen_movements(1)
        p2 = self.count_legal_queen_movements(2)
        if p1 == 0 and p2 == 0:
            return (self.turn - 1) % 2  # player who just moved wins
        elif p1 == 0:  # player 2 won
            return 1
        elif p2 == 0:  # player 1 won
            return 0
        else:  # game going on
            return -1
