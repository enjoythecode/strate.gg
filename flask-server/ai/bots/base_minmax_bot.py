import amazons_agent
import math

MAX_CALCULATIONS = 10000
MAX_VAL = 1e9
MIN_VAL = -1e9


class GameNode:
    def __init__(self, game_state, depth, move=None, max_depth = 2):
        self.state = game_state.clone()
        self.children = []
        self.depth = depth
        self.move = move  # only undefined for root node. root node only functions as a holder of other nodes so it's ok
        self.isLeaf = False
        self.MAX_DEPTH = max_depth
        if depth == 0:  # only in the root node, calculate MAX_DEPTH
            self.MAX_DEPTH = math.log(MAX_CALCULATIONS, max(len(self.state.get_possible_moves()), 2)) / 2

        if depth < self.MAX_DEPTH:
            possible_moves = self.state.get_possible_moves()
            if possible_moves:
                for possible_move in possible_moves:
                    possible_game = self.state.clone()
                    possible_game.make_move(possible_move)
                    self.children.append(GameNode(possible_game, self.depth + 1, possible_move, self.MAX_DEPTH))
            else:
                self.isLeaf = True
        else:
            self.isLeaf = True

        if depth == 0:  # only in the root node, calculate MAX_DEPTH
            self.MAX_DEPTH = math.log(MAX_CALCULATIONS, max(len(self.children), 2))
            print(self.MAX_DEPTH)


class BaseMinmaxBot(amazons_agent.AmazonsAgent):

    def __init__(self, friend, enemy):
        self.meta_name = "Base minmax implementation to be extended by other bots"
        self.meta_developer = "Anonymous"
        self.meta_description = "Description goes here"
        self.friend = friend
        self.enemy = enemy

    def greet(self):
        print(self.meta_name + " by " + self.meta_developer + ". [" + self.meta_description + "]")

    def next_move(self, board_state):
        """
        Takes in a amazons_state and returns a move object ["AB","CD","EF"]
        """

        # generate tree
        tree_root = GameNode(board_state.clone(), 0)

        # generate best move
        return self.minimax(tree_root, 0, True, MIN_VAL, MAX_VAL)

    def utility(self, board):
        """to be overwritten by inheriting classes"""
        raise NotImplementedError("Utility functions not implemented by the child class!")

    def evaluate(self, board):
        """a wrapper over the utility function. automatically calculates game end. uses the utility() function"""
        res = board.check_game_end()
        if res == 0:
            return self.utility(board)
        elif res == 1:
            return MAX_VAL + 1  # white win
        elif res == 2:
            return MIN_VAL - 1  # black win

    def minimax(self, node, curr_depth, is_maximizing_player, alpha, beta):
        best_move = None

        if node.isLeaf:
            return self.utility(node.state)

        if is_maximizing_player:

            best = MIN_VAL

            for child in node.children:

                val = self.minimax(child, curr_depth + 1, not is_maximizing_player, alpha, beta)
                if val > best:
                    best = val
                    best_move = child.move
                alpha = max(alpha, best)

                if beta <= alpha:
                    break

        else:
            best = MAX_VAL

            for child in node.children:

                val = self.minimax(child, curr_depth + 1, not is_maximizing_player, alpha, beta)
                if val < best:
                    best = val
                    best_move = child.move
                beta = min(beta, best)

                if beta <= alpha:
                    break

        # top level function call should return the best move but inner nodes should return their value
        if curr_depth == 0:
            return best_move
        else:
            return best
