from . import base_minmax_bot


class AmazonsPlayer(base_minmax_bot.BaseMinmaxBot):
    def __init__(self, friend, enemy):
        self.meta_developer = "enjoythecode"
        self.meta_name = "Blocking2Victory (B2V) v6"
        self.meta_description = "Maximises delta(possible moves). Inherits dynamic minimax with ab-pruning."
        self.meta_id = "BTV_0006"
        self.friend = friend
        self.enemy = enemy

    def utility(self, board):
        return board.count_possible_moves(self.friend) - board.count_possible_moves(self.enemy)
