from . import base_minmax_bot


class AmazonsPlayer(base_minmax_bot.BaseMinmaxBot):
    def __init__(self, friend, enemy):
        self.meta_developer = "enjoythecode"
        self.meta_name = "Blocking2Victory (B2V) v3"
        self.meta_description = "Maximizes queen mobility of itself. Inherits dynamic minimax with ab-pruning."
        self.meta_id = "BTV_0003"
        self.friend = friend
        self.enemy = enemy

    def utility(self, board):
        return board.count_possible_queen_moves(self.friend)
