import base_amazons_player

class AmazonsPlayer(base_amazons_player.AmazonsPlayer):

	def __init__(self, friend, enemy):
		self.meta_name = "Human-Computer Interface"
		self.meta_developer = "Evolution"
		self.meta_description = "Makes pseudo-random moves"
		self.meta_id = "HUM_0001"
		self.friend = friend
		self.enemy = enemy

	def greet(self):
		print(self.meta_name + " by " + self.meta_developer + ". [" + self.meta_description + "]")

	def next_move(self, state):
		"""
		Takes in a amazons_state and returns a move object ["AB","CD","EF"]
		"""
		return input("Human's next move: ").split(" ")