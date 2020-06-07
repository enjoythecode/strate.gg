from . import base_minmax_bot


class AmazonsPlayer(base_minmax_bot.BaseMinmaxBot):
    def __init__(self, friend, enemy):
        self.meta_developer = "enjoythecode"
        self.meta_name = "Blocking2Victory (B2V) v5"
        self.meta_description = "Minimises queen mobility of its enemy. Inherits dynamic minimax with ab-pruning."
        self.meta_id = "BTV_0005"
        self.friend = friend
        self.enemy = enemy

    def utility(self, board):
        return -1 * board.count_possible_queen_moves(self.enemy)
