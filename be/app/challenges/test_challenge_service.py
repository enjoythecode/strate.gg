from .challenge_service import calc_time_user_used_from_timestamps


def test_used_time_calc():
    assert calc_time_user_used_from_timestamps([0, 10, 20]) == 10
    assert calc_time_user_used_from_timestamps([0]) == 0
    assert calc_time_user_used_from_timestamps([0, 10]) == 10
    assert calc_time_user_used_from_timestamps([0, 10, 20, 35]) == 25
