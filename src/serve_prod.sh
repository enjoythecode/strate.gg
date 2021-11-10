# DEPLOYS A PRODUCTION SERVER

# build react app
cd fe
npm run build

# Back-end
cd ../be

## Go into venv
source ./venv/bin/activate

## Start gunicorn
export FLASK_ENV=production
gunicorn "app:app" &