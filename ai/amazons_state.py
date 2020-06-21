import copy

starting_board_6x0 = [
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0]
]

starting_board_4x0 = [
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0]
]


def prettify_board_character(n):
    '''Convenience method that turns the board representation of different board entities to their representations
    '''
    return ".WBX"[n]


class AmazonsState:
    """ 
    Holds the state of the Game of Amazons (board etc.).
    Players are numbered 1 and 2.
    Assumes a square board.
    """

    def __init__(self, board, pjm=2):
        self.playerJustMoved = pjm  # At the root pretend the player just moved is player 2 - player 1 moves first
        self.board = copy.deepcopy(board)
        self.game_size = len(board)
        self.number_of_turns = 0  # used to track the total number of shots which is used to calculate points in the end

    def clone(self):
        """ Create a deep clone of this game state.
        """
        st = AmazonsState(copy.deepcopy(self.board), self.playerJustMoved)
        return st

    def make_move(self, move):
        """ Update a state by carrying out the given move.
            Must update playerJustMoved.
        """
        self.playerJustMoved = 3 - self.playerJustMoved
        self.board[int(move[0][0])][int(move[0][1])] = 0
        self.board[int(move[1][0])][int(move[1][1])] = self.playerJustMoved
        self.board[int(move[2][0])][int(move[2][1])] = 3

        self.number_of_turns += 1

    def count_possible_moves(self, player=None):
        """ Get # of possible moves from this state.
        """
        out = 0
        if player is None:
            player = 3 - self.playerJustMoved

        queen_moves = self.get_possible_queen_moves(player)

        for q in queen_moves:
            out += self.count_possible_shots_from_queen(q[1], q[0])

        return out

    def get_possible_moves(self, player=None):
        """
        Returns a list of all possible moves from this state.
        ---
        Arguments:
            player: [1, 2]. The player to get the theoric possible moves from. Does not take into account turns.
                Defaults to player with the turn.
        ---
        Returns:
            out: list of possible moves of the given player.
        
        """
        out = []
        if player is None:
            player = 3 - self.playerJustMoved

        queen_moves = self.get_possible_queen_moves(player)
        for q in queen_moves:
            out.extend([[q[0], q[1], s] for s in self.get_possible_shots_from_queen(q[1], q[0])])
        return out

    def get_possible_queen_moves(self, player=None):
        out = []
        if player is None:
            player = 3 - self.playerJustMoved
        for q_x in range(self.game_size):
            for q_y in range(self.game_size):
                if self.board[q_x][q_y] == player:
                    q = str(q_x) + str(q_y)
                    out.extend([[q, x] for x in self.get_valid_moves(q)])

        return out

    def count_possible_queen_moves(self, player=None):
        if player is None:
            player = 3 - self.playerJustMoved
        out = 0

        for q_x in range(self.game_size):
            for q_y in range(self.game_size):
                if self.board[q_x][q_y] == player:
                    q = str(q_x) + str(q_y)
                    out += self.count_valid_moves(q)

        return out

    def get_possible_shots_from_queen(self, source, ignore):
        return self.get_valid_moves(source, ignore, True)

    def count_possible_shots_from_queen(self, source, ignore):
        return self.count_valid_moves(source, ignore, True)

    def get_valid_moves(self, cell_from, ignore=None, include_ignore=False):
        out = []
        from_x = int(cell_from[0])
        from_y = int(cell_from[1])
        ignore_x = int(ignore[0]) if ignore is not None else -1
        ignore_y = int(ignore[1]) if ignore is not None else -1

        x, y = from_x, from_y
        while x + 1 < self.game_size:
            x += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while x > 0:
            x -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while y + 1 < self.game_size:
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while y > 0:
            y -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while x + 1 < self.game_size and y + 1 < self.game_size:
            x += 1
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while x + 1 < self.game_size and y > 0:
            x += 1
            y -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while x > 0 and y + 1 < self.game_size:
            x -= 1
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out.append(str(x) + str(y))
                    continue
                else:
                    break
            else:
                out.append(str(x) + str(y))

        x, y = from_x, from_y
        while x > 0 and y > 0:
            x -= 1
            y -= 1
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

    def count_valid_moves(self, cell_from, ignore=None, include_ignore=False):
        '''
            Different from len(get_valid_moves) because natively counting is marginally faster than
            adding all the possible moves to a list and counting it. 
            
            This method will be deprecated after the implementation of bitboard move calculation.
        '''
        out = 0
        from_x = int(cell_from[0])
        from_y = int(cell_from[1])
        ignore_x = int(ignore[0]) if ignore is not None else -1
        ignore_y = int(ignore[1]) if ignore is not None else -1

        x, y = from_x, from_y
        while x + 1 < self.game_size:
            x += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while x > 0:
            x -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while y + 1 < self.game_size:
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while y > 0:
            y -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while x + 1 < self.game_size and y + 1 < self.game_size:
            x += 1
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while x + 1 < self.game_size and y > 0:
            x += 1
            y -= 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while x > 0 and y + 1 < self.game_size:
            x -= 1
            y += 1
            if self.board[x][y] != 0:
                if ignore_x == x and ignore_y == y:
                    if include_ignore:
                        out += 1
                    continue
                else:
                    break
            else:
                out += 1

        x, y = from_x, from_y
        while x > 0 and y > 0:
            x -= 1
            y -= 1
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
            return self.playerJustMoved  # player who just moved wins
        elif p1 == 0: # player 2 won
            return 2
        elif p2 == 0: # player 1 won
            return 1
        else:  # game going on
            return 0

    def __repr__(self):
        """ Returns a string representation of the board.
        """
        return "\n".join(
            [" ".join([prettify_board_character(c) for c in x]) for x in self.board]
        )
