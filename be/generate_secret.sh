# SystemRandom is secure, 2^1024 is almost INF!

if [ ! -f "be/config.json" ];
then
    scrt=$(python -c 'import random; print(hex(random.SystemRandom().getrandbits(1024)))')
    echo {\"SECRET_KEY\":\"$scrt\"} > be/config.json
fi
