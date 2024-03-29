from abc import ABC
from abc import abstractmethod


class GameState(ABC):
    @abstractmethod
    def __init__(self):
        raise NotImplementedError("Not implemented!")  # pragma: no cover

    @staticmethod
    @abstractmethod
    def is_valid_config(config):
        raise NotImplementedError("Not implemented!")  # pragma: no cover

    @staticmethod
    @abstractmethod
    def create_from_config(config):
        raise NotImplementedError("Not implemented!")  # pragma: no cover

    @abstractmethod
    def get_max_no_players(self):
        raise NotImplementedError("Not implemented!")  # pragma: no cover

    @abstractmethod
    def is_valid_move(self, move):
        raise NotImplementedError("Not implemented!")  # pragma: no cover

    @abstractmethod
    def make_move(self, move):
        raise NotImplementedError("Not implemented!")  # pragma: no cover
