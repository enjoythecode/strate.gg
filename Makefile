# Usage explained in CONTRIBUTING.md

# References I used:
# https://stackoverflow.com/a/70572654

# Use SYSTEM_PYTHON to create venv
SYSTEM_PYTHON  = $(or $(shell which python3), $(shell which python))

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: venv deps deps-be deps-fe install-commit-hooks

venv:
	(rm -rf venv && \
    $(SYSTEM_PYTHON) -m venv venv)

deps: deps-be deps-fe install-commit-hooks

deps-be:
	($(SYSTEM_PYTHON) -m venv venv && \
	. ./venv/bin/activate && \
	venv/bin/python -m pip install --upgrade pip -r requirements.txt -r requirements-dev.txt)

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

# TESTING
# -----------------------------------------------------------------------------
.PHONY: test
test: gen-secret
	(cd be && pytest)

.PHONY: cover
cover: gen-secret
	(cd be && coverage run -m pytest && coverage report --sort cover)

.PHONY: covero
covero: gen-secret
	(cd be && coverage html && open htmlcov/index.html)

# BUILDING DEVELOPMENT SERVERS
# -----------------------------------------------------------------------------
.PHONY: gen-secret devup devupd devdown devup-fbuild compile-client

gen-secret:
	./be/generate_secret.sh

# uses docker compose to start a complete dev server
# does not use -d because this is a development server and we may want to see stdout. see devupd
devup: gen-secret
	docker compose -p "dev" -f docker/docker-compose.dev.yml up

devupd: gen-secret
	docker compose -p "dev" -f docker/docker-compose.dev.yml up -d

# shut down the development server running with docker compose
devdown:
	docker compose -p "dev" -f docker/docker-compose.dev.yml down

# like devup, but forces a rebuild of the underlying images
devup-fbuild: gen-secret
	docker compose -p "dev" -f docker/docker-compose.dev.yml up --build

# compile a production-optimized version of the client code
compile-client:
	(cd fe && npm run build && rm -rf ../be/client && mkdir ../be/client && cp -r build/ ../be/client)

# BUILDING PRODUCTION SERVERS
# --------
.PHONY: produp produpd proddown produp-fbuild
produp: gen-secret
	docker compose -p "prod" -f docker/docker-compose.prod.yml up

produpd: gen-secret
	docker compose -p "prod" -f docker/docker-compose.prod.yml up -d

proddown:
	docker compose -p "prod" -f docker/docker-compose.prod.yml down

produp-fbuild: gen-secret
	docker compose -p "prod" -f docker/docker-compose.prod.yml up --build


# DEBUGGING DOCKER
# ------- below commands shouldn't be needed for building in 99% of cases. -------

.PHONY: build-dev-be run-dev-be build-dev-fe run-dev-fe
# docker build the BE container for development
build-dev-be: gen-secret
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
	rm -rf venv fe/node_modules be/__pycache__
