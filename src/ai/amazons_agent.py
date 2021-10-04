class AmazonsAgent:
	'''
		Defines the common methods of all Amazons agents.
		All Amazons agents should extend this class.
	'''
	
	def __init__(self, friend, enemy):
		self.meta_name = "Base amazons implementation to be extended by AI"
		self.meta_developer = "Anonymous"
		self.meta_description = "Description goes here"
		self.friend = friend
		self.enemy = enemy

	def greet(self):
		print(self.meta_name + " by " + self.meta_developer + ". [" + self.meta_description + "]")

	def next_move(self, board_state):
		"""
		Takes in a amazons_state and returns a move object ["AB","CD","EF"]
		"""
		raise NotImplementedError("Not implemented!")