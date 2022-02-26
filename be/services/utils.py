import random
import string


# Returns a random string of the given size from the given charset
def generate_random_id(size, charset=string.ascii_uppercase + string.digits):
    return "".join(random.choice(charset) for x in range(size))
