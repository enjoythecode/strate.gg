# Usage explained in CONTRIBUTING.md

# References I used:
# https://stackoverflow.com/a/70572654

# Use SYSTEM_PYTHON to create venv
SYSTEM_PYTHON  = $(or $(shell which python3), $(shell which python))

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: deps deps-be deps-py deps-fe install-commit-hooks
deps: deps-py deps-fe install-commit-hooks

deps-be: deps-py # just an alias
deps-py: venv/bin/activate
deps-fe: | fe/node_modules

venv/bin/activate:
	($(SYSTEM_PYTHON) -m venv venv && \
	. ./venv/bin/activate && \
	venv/bin/python -m pip install --upgrade pip -r requirements.txt)

fe/node_modules:
	(cd fe && npm ci)

install-commit-hooks: deps-py
	venv/bin/pre-commit install


# PRE-COMMIT COMMANDS
# -----------------------------------------------------------------------------
.PHONY: check check-all

check: deps-py # run pre-commit on changed files (same as on-commit behavior)
	venv/bin/pre-commit run
check-all: deps-py # run pre-commit on all files
	venv/bin/pre-commit run --all-files


# TESTING
# -----------------------------------------------------------------------------

.PHONY: test fest best jest jestc
test: fest best

fest: deps-fe
	(cd fe && npm run test)
best: deps-py gen-secret compile-client
	(. venv/bin/activate && cd be && python -m pytest)

jest: deps-fe # runs in watch mode
	(cd fe && npm run jest)
jestc: deps-fe # runs in watch mode with coverage
	(cd fe && npm run jestc)


# COVERAGE
# -----------------------------------------------------------------------------
# terminology:
#	variations of "*over"    print the coverage in the terminal
# 	variations of "*overage" open an HTML report

.PHONY: cover bover fover foverw boverage

cover:  bover fover
bover: gen-secret deps-py
	(. venv/bin/activate && \
		cd be && \
		coverage run -m pytest && \
		coverage report --sort cover)
fover: deps-fe
	(cd fe && npm run coverage)

foverw: deps-fe # fover with watch
	(cd fe && npm run coverage-watch)

boveropen: deps-py # run bover and open html report
	(cd be && coverage run -m pytest && coverage html && open htmlcov/index.html)

# BUILD HELPERS
# -----------------------------------------------------------------------------
.PHONY: gen-secret compile-client
gen-secret:
	(cd be && ./generate_secret.sh)

compile-client: be/client/index.html
be/client/index.html: deps-fe
	(cd fe && \
		npm run build && \
		rm -rf ../be/client && \
		cp -r build/ ../be/client)

# BUILDING DEVELOPMENT SERVERS
# -----------------------------------------------------------------------------
.PHONY: dev devd devdown dev-build dev-build-nocache

dev: gen-secret
	docker compose -p "dev" -f docker/docker-compose.dev.yml up
devd:
	docker compose -p "dev" -f docker/docker-compose.dev.yml up -d
devdown:
	docker compose -p "dev" down
dev-build: # re-build container in case of change to Docker files
	docker compose -p "dev" -f docker/docker-compose.dev.yml up --build
dev-build-nocache: # force a no-cache rebuild (does not start after build)
	docker compose -f ./docker/docker-compose.dev.yml build --no-cache

# BUILDING PRODUCTION SERVERS
# -----------------------------------------------------------------------------
.PHONY: prod prodd proddown prod-build prod-build-nocache

prod:
	docker compose -p "prod" -f docker/docker-compose.prod.yml up
prodd:
	docker compose -p "prod" -f docker/docker-compose.prod.yml up -d
proddown:
	docker compose -p "prod" down
prod-build:
	docker compose -p "prod" -f docker/docker-compose.prod.yml up --build
prod-build-nocache:
	docker compose -f ./docker/docker-compose.prod.yml build --no-cache


# MISCELLANEOUS
# -----------------------------------------------------------------------------
.PHONY: clean
clean:
	rm -rf venv fe/node_modules be/__pycache__
