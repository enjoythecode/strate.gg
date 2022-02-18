import amazons_state
from bots import base_minmax_bot, blocker_v6, mcts_v1
import time
import itertools


bots = [mcts_v1, blocker_v6]


class Game:
    def __init__(self, game_size=10, game_config=0):
        self.players = [mcts_v1]
        starting_board = None

        if game_size == 6 and game_config == 0:
            starting_board = amazons_state.starting_board_6x0
        elif game_size == 4 and game_config == 0:
            starting_board = amazons_state.starting_board_4x0
        elif game_size == 10 and game_config == 0:
            starting_board = amazons_state.starting_board_10x0

        self.state = amazons_state.AmazonsState(starting_board)

        # 2021-09-28 Amazons Game against hself on BGG
        self.state.make_move(["96", "46", "13"])
        self.state.make_move(["03", "58", "68"])

        self.state.make_move(["93", "63", "67"])
        self.state.make_move(["06", "42", "45"])

        self.state.make_move(["63", "33", "53"])
        self.state.make_move(["42", "72", "78"])

        self.state.make_move(["60", "63", "73"])
        print(self.state)

        self.suggestions()

    def suggestions(self):

        for player in self.players:
            time_start = time.time()
            p = player.AmazonsPlayer(2, 1)
            move = p.next_move(self.state)
            time_end = time.time()
            print(p.meta_name, move, time_end - time_start)


g = Game()
