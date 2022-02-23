#TODO: checking for requirements

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: setup setup-pc setup-fe setup-be
setup: setup-pc setup-fe setup-be
setup-pc:
	pre-commit install
setup-fe:
# npm ci instead of i because it ensures consistency with package-lock.json. source:
# https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore#48524475
	(cd fe && npm ci)
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
.PHONY: gen-secret devup devupd dewdown devup-fbuild
.PHONY: build-dev-be run-dev-be build-dev-fe run-dev-fe

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
devup-fbuild:
	docker compose -f docker/docker-compose.dev.yml up --build -d

# docker build the BE container for development
build-dev-be:
	docker build --file docker/dev.be.Dockerfile . -t dev.be

# docker run the BE container for development
run-dev-be:
	docker run -i -t -p 8080:8080 dev.be


# docker build the FE container for development
build-dev-fe:
	docker build --file docker/dev.fe.Dockerfile . -t dev.fe

# docker run the FE container for development
run-dev-fe:
	docker run -i -t -p 3000:3000 dev.fe
