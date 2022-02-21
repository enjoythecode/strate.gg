# SystemRandom is secure, 2^1024 is almost INF!
scrt=$(python -c 'import random; print(hex(random.SystemRandom().getrandbits(1024)))')
echo {\"SECRET_KEY\":\"$scrt\"} > be/config.json
