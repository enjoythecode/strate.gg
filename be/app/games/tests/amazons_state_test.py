import pytest

from ..amazons_state import AmazonsState

# TODO: re-style to PyTest classes?


@pytest.fixture
def amazons_class():
    return AmazonsState


@pytest.mark.usefixtures("amazons_class")
def test_default_config_is_the_10x10_board_with_standard_placements(amazons_class):
    implicit_config = amazons_class()
    std_config = {"size": 10, "variation": 0}
    explicit_config = amazons_class(config=std_config)

    assert implicit_config.__repr__() == explicit_config.__repr__()
