# Deploys a development server

# Front-end
## Development React server
cd fe
npm run start > /dev/null & # prevent npm from hogging up the terminal! (will still print errors) [1]
export REACT_DEV_SERVER_PID=$! # save the PID of the bg [2] so that we can kill it later
echo $REACT_DEV_SERVER_PID

# Back-end
cd ../be

## Python virtual environment
source ./venv/bin/activate

## Development, debug flask server
export FLASK_ENV=development
python app.py

# 1. https://stackoverflow.com/questions/65313001/way-to-run-react-development-server-in-a-background
# 2. https://serverfault.com/questions/205498/how-to-get-pid-of-just-started-process