#!/bin/sh

# expects that $PWD is the folder this script is in

if [ ! -f "$PWD/app/secret_key.json" ];
then
    # SystemRandom is secure, 2^1024 is almost INF!
    scrt=$(python3 -c 'import random; print(hex(random.SystemRandom().getrandbits(1024)))')
    echo {\"SECRET_KEY\":\"$scrt\"} > $PWD/app/secret_key.json
else
    echo "secret file already exists!"
fi
