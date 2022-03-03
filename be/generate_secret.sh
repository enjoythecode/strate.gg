# SystemRandom is secure, 2^1024 is almost INF!

if [ ! -f "be/secret_key.json" ];
then
    scrt=$(python -c 'import random; print(hex(random.SystemRandom().getrandbits(1024)))')
    echo {\"SECRET_KEY\":\"$scrt\"} > be/app/secret_key.json
fi
