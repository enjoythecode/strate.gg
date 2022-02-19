# DEPLOYS A PRODUCTION SERVER

# build react app
cd fe
npm run build

# Back-end
cd ../be

## Go into venv
source ./venv/bin/activate

## Start gunicorn in a new tmux session
tmux new-session -d -s sess_gunicorn 'export FLASK_ENV=production; gunicorn "app:app" -k eventlet'
