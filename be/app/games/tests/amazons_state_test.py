import pytest

from ..amazons_state import AmazonsState


@pytest.fixture
def amazons_state_default():
    yield AmazonsState()


@pytest.fixture
def amazons_state_10x10():
    yield AmazonsState({"size": 10, "variation": 0})


@pytest.fixture
def amazons_state_6x6():
    yield AmazonsState({"size": 6, "variation": 0})


def test_default_config_is_the_10x10_board(amazons_state_default, amazons_state_10x10):
    assert amazons_state_default.__repr__() == amazons_state_10x10.__repr__()


def test_10x10_board_has_correct_placement(amazons_state_10x10):

    expected_10x10_view = (
        ". . . B . . B . . .\n"
        ". . . . . . . . . .\n"
        ". . . . . . . . . .\n"
        "B . . . . . . . . B\n"
        ". . . . . . . . . .\n"
        ". . . . . . . . . .\n"
        "W . . . . . . . . W\n"
        ". . . . . . . . . .\n"
        ". . . . . . . . . .\n"
        ". . . W . . W . . ."
    )

    assert amazons_state_10x10.__str__() == expected_10x10_view


def test_6x6_board_has_correct_placement(amazons_state_6x6):
    expected_6x6_view = (
        ". . W . . .\n"
        ". . . . . .\n"
        ". . . . . B\n"
        "B . . . . .\n"
        ". . . . . .\n"
        ". . . W . ."
    )

    assert amazons_state_6x6.__str__() == expected_6x6_view


def test_amazons_generate_random_play_is_consistent_with_itself(amazons_state_10x10):
    generated_moves = AmazonsState.generate_random_play()
    # TODO: fix random seed
    for move in generated_moves:
        assert amazons_state_10x10.is_valid_move(move)
        amazons_state_10x10.make_move(move)
    assert amazons_state_10x10.check_game_end() != 0


def test_amazons_possible_first_moved_is_counted_correctly(amazons_state_10x10):
    # source: https://www.chessprogramming.org/Amazons#Branching_Factor
    first_move_branching_factor = 2176

    assert len(amazons_state_10x10.get_possible_moves()) == first_move_branching_factor
