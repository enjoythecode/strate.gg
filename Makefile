# Usage explained in CONTRIBUTING.md

# References I used:
# https://stackoverflow.com/a/70572654

# If `venv/bin/python` exists, it is used. If not, use PATH to find python.
SYSTEM_PYTHON  = $(or $(shell which python3), $(shell which python))
PYTHON         = $(or $(wildcard venv/bin/python), $(SYSTEM_PYTHON))

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: venv deps deps-be deps-fe install-commit-hooks

venv:
	(rm -rf venv && \
    $(PYTHON) -m venv venv)

deps: deps-be deps-fe install-commit-hooks

deps-be:
	($(PYTHON) -m venv venv && \
	. ./venv/bin/activate && \
	$(PYTHON) -m pip install --upgrade pip -r requirements.txt -r requirements-dev.txt)

deps-fe:
# npm ci instead of i because it ensures consistency with package-lock.json. source:
# https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore#48524475
	(cd fe && npm ci)

install-commit-hooks:
	venv/bin/pre-commit install


# PRE-COMMIT COMMANDS
# -----------------------------------------------------------------------------
.PHONY: check-all check
check-all:
	venv/bin/pre-commit run --all-files

# run pre-commit checks on modified
check:
	venv/bin/pre-commit run

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
	docker compose -f docker/docker-compose.dev.yml up --build

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

# ADMINISTRATIVE
# -----------------------------------------------------------------------------
.PHONY: clean-deps
clean-deps:
	rm -rf venv fe/node_modules be/__pycache__ be/config.json
