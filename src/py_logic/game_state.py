from abc import ABC, abstractmethod
 
class GameState(ABC):
 
    @abstractmethod
    def __init__(self):
        raise NotImplementedError("Not implemented!")

    @abstractmethod
    @staticmethod
    def create_from_config(config):
        raise NotImplementedError("Not implemented!")

    @abstractmethod
    def get_max_no_players(self):
        raise NotImplementedError("Not implemented!")

    @abstractmethod
    def is_valid_move(self, move):
        raise NotImplementedError("Not implemented!")

    @abstractmethod
    def make_move(self, move):
        raise NotImplementedError("Not implemented!")