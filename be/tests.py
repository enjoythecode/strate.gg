from py_logic.mancala_state import MancalaState

m = MancalaState.create_from_config({})
print(m)
m.make_move({"pit": 2})
m.make_move({"pit": 1})
print(m)