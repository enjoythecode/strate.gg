# Downloads all dependencies and sets configurations that is common between production and development environments

# npm
cd fe
npm install

# python

## set up venv
cd ../be
python3 -m venv venv
source ./venv/bin/activate

## download reqs.txt
pip install -r requirements.txt

## create secret key
scrt=$(python -c 'import random; print(hex(random.SystemRandom().getrandbits(1024)))') # SystemRandom is secure, 2^1024 is almost INF!
echo {\"SECRET_KEY\":\"$scrt\"} > config.json

cd ..