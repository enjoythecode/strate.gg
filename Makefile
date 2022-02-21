#TODO: checking for requirements

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: setup setup-pc setup-fe setup-be
setup: setup-pc setup-fe setup-be
setup-pc:
	pre-commit install
setup-fe:
	(cd fe && npm install)
setup-be:
	(python3 -m venv venv && \
	source ./venv/bin/activate && \
	pip install -r requirements.txt)

# PRE-COMMIT COMMANDS
# -----------------------------------------------------------------------------
.PHONY: check-all
check-all:
	pre-commit run --all-files

# run pre-commit checks on modified
.PHONY: check
check:
	pre-commit run

# BUILDING DEVELOPMENT SERVERS WITH DOCKER
# -----------------------------------------------------------------------------
.PHONY: gen-secret devup devupd dewdown devup-build build-dev-be run-dev-be

gen-secret:
	./be/generate_secret.sh

# uses docker compose to start a complete dev server
# does not use -d because this is a development server and we may want to see stdout. see devupd
devup:
	docker compose -f docker/docker-compose.dev.yml up

devupd:
	docker compose -f docker/docker-compose.dev.yml up -d

# shut down the development server running with docker compose
devdown:
	docker compose -f docker/docker-compose.dev.yml down

# --- below commands shouldn't be needed for building in 99% of cases.

# like devup, but forces a rebuild of the underlying images
devup-build:
	docker compose -f docker/docker-compose.dev.yml up --build -d

# docker build the BE container for development
build-dev-be:
	docker build --file docker/Dockerfile.dev.be . -t dev.be

# docker run the BE container for development
run-dev-be:
	docker run -i -t -p 8080:8080 dev.be
