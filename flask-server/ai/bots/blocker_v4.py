from . import base_minmax_bot


class AmazonsPlayer(base_minmax_bot.BaseMinmaxBot):
    def __init__(self, friend, enemy):
        self.meta_developer = "enjoythecode"
        self.meta_name = "Blocking2Victory (B2V) v4"
        self.meta_description = "Maximises delta(queen mobility). Inherits dynamic minimax with ab-pruning."
        self.meta_id = "BTV_0004"
        self.friend = friend
        self.enemy = enemy

    def utility(self, board):
        return board.count_possible_queen_moves(self.friend) - board.count_possible_queen_moves(self.enemy)
