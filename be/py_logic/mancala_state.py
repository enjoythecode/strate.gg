from py_logic import game_state
import copy

starting_board = {
    "pits": [
        [4, 4, 4, 4, 4, 4],
        [4, 4, 4, 4, 4, 4]
    ],
    "banks": [0, 0]
}

class MancalaState(game_state.GameState):

    def __init__(self, board, pjm = 2):
        self.playerJustMoved = pjm  # At the root pretend the player just moved is player 2 - player 1 moves first
        self.board = copy.deepcopy(board)
        self.game_size = len(board)
        self.number_of_turns = 0  # used to track the total number of shots which is used to calculate points in the end

    @classmethod
    def is_valid_config(self, config):
        return config == {}

    @classmethod
    def create_from_config(self, config):
        return MancalaState(starting_board)

    @classmethod
    def get_max_no_players(self):
        return 2

    def game_data(self):
        """Returns relevant game data in a dictionary. Intended to be passed onto a client for consumption"""
        return {
            "board": self.board,
            "game_size": self.game_size,
            "turn": 3 - self.playerJustMoved,
            "turns_taken": self.number_of_turns
        }

    def clone(self):
        """ Create a deep clone of this game state.
        """
        return MancalaState(copy.deepcopy(self.board), self.playerJustMoved)

    def make_move(self, move):
        pit_no = move["pit"]
        self.board["pits"][3 - self.playerJustMoved][pit_no] = 0

        ptr = pit_no
        while seeds:
            ptr += 1
            if ptr == 6: # self-bank
                self.board["banks"][3 - self.playerJustMoved] += 1
            elif ptr == 13: # opponent-bank
                ptr = 0
                continue
            else:
                side = (3 - self.playerJustMoved + (ptr // 6)) % 2
                self.board["pits"][side][ptr%6-(1 if ptr > 6 else 0)] += 1
            seeds -= 1
        
        # if move ended in an empty on our side, capture!
        # TODO: other rule-sets have this at even OR empty
        if ptr < 6 and self.pits[self.curr_player][ptr] == 1: 
            captured = self.pits[self.curr_player][ptr]
            captured += self.pits[self.next_player][5-ptr]
            self.board["banks"][self.curr_player] += captured

            self.board["pits"][self.curr_player][ptr] = 0
            self.board["pits"][self.next_player][5-ptr] = 0

        if not ptr == 6: # if move didn't end in self-bank, turn moves to the next player
            self.turn = 3 - self.playerJustMoved

    def is_valid_move(self, move):
        if not "pit" in move:
            return False
        pit_no = move["pit"]
        if not (0 <= pit_no <= 5):
            return False
        
        seeds = self.board["pits"][3 - self.playerJustMoved][pit_no]
        if seeds == 0:
            return False
        return True

    # TODO: add the sweeping logic to make_move
    # TODO: call is_game_over at the end of all moves in all games?!
    def is_game_over(self):
        '''
        Return (game_is_over, winner)
        where game_is_over is a bool representing if the game is over,
        and winner is either None (if game_is_over == False), or the number of the player who won, or -1 if tie.
        '''
        if sum(self.pits[self.curr_player]) > 0:
            return False, None
        else:
            scores = self.banks
            scores[self.curr_player] += sum(self.pits[self.next_player]) # curr player gets all the seeds in their opponents pits
            winner = -1 # default to a tie
            if scores[0] > scores[1]:
                winner = 0
            elif scores[0] < scores[1]:
                winner = 1
            return True, winner

    def __repr__(self): # string representation of the board from the perspective of P0
        # TODO improve padding for the banks
        string = ""

        string += "|" + "|".join([str(x) for x in self.board["pits"][1][::-1]]) + "|"
        string += "\n"
        string += str(self.board["banks"][1]) + "-"*11 + str(self.board["banks"][0])
        string += "\n"
        string += "|" + "|".join([str(x) for x in self.board["pits"][0]]) + "|"
        string += "\n"

        return string
