from py_logic.mancala_state import MancalaState

m = MancalaState.create_from_config({})
print(m)

m.make_move({"pit": 2})
print(m)

m.make_move({"pit": 4})
print(m)

m.make_move({"pit": 0})
print(m)

m.make_move({"pit": 0})
print(m)