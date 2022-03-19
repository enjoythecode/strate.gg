# Usage explained in CONTRIBUTING.md

# References I used:
# https://stackoverflow.com/a/70572654

# Use SYSTEM_PYTHON to create venv
SYSTEM_PYTHON  = $(or $(shell which python3), $(shell which python))

# REPOSITORY SET-UP
# -----------------------------------------------------------------------------
.PHONY: deps
deps: deps-be deps-fe install-commit-hooks

.PHONY: deps-be
deps-be:
	($(SYSTEM_PYTHON) -m venv venv && \
	. ./venv/bin/activate && \
	venv/bin/python -m pip install --upgrade pip -r requirements.txt)

.PHONY: deps-fe
deps-fe:
# npm ci instead of i because it ensures consistency with package-lock.json. source:
# https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore#48524475
	(cd fe && npm ci)

.PHONY: install-commit-hooks
install-commit-hooks:
	venv/bin/pre-commit install


# PRE-COMMIT COMMANDS
# -----------------------------------------------------------------------------
.PHONY: check-all
check-all:
	venv/bin/pre-commit run --all-files

# run pre-commit checks on modified
.PHONY: check
check:
	venv/bin/pre-commit run

# TESTING
# -----------------------------------------------------------------------------

# jest runs in watch mode, automatically re-running affected files on change
.PHONY: jest
jest:
	(cd fe && npm run jest)

# jestc runs in watch mode, with --coverage enabled, showing coverage with each
# test run
.PHONY: jestc
jestc:
	(cd fe && npm run jestc)

# test runs tests for both FE and BE
.PHONY:
test: be-test fe-test

# fe-test runs the tests once, without interactive/watch mode
.PHONY: fe-test fest
fest: fe-test
fe-test:
	(cd fe && npm run test)

.PHONY: be-test best
best: be-test
be-test: gen-secret compile-client
	(cd be && python -m pytest)

# COVERAGE
# -----------------------------------------------------------------------------
# terminology:
#	variations of "*over"    print the coverage in the terminal
# 	variations of "*overage" open an HTML report

# runs coverage on FE + BE
.PHONY: cover
cover: gen-secret bover fover

# runs coverage on BE
.PHONY: bover
bover:
	(cd be && coverage run -m pytest && coverage report --sort cover)

# runs coverage on FE
.PHONY: fover
fover:
	(cd fe && npm run coverage)

.PHONY: foverw
foverw:
	(cd fe && npm run coverage-watch)

# TODO add FE/BE distinction to this
.PHONY: boverage
boverage:
	(cd be && coverage run -m pytest && coverage html && open htmlcov/index.html)

# BUILDING DEVELOPMENT SERVERS
# -----------------------------------------------------------------------------
.PHONY: gen-secret
gen-secret:
	./be/generate_secret.sh

# uses docker-compose to start a complete dev server
# does not use -d because this is a development server and we may want to see stdout. see devupd
.PHONY: devup
devup: gen-secret
	docker-compose -p "dev" -f docker/docker-compose.dev.yml up

.PHONY: devupd
devupd: gen-secret
	docker-compose -p "dev" -f docker/docker-compose.dev.yml up -d

# shut down the development server running with docker-compose
.PHONY: devdown
devdown:
	docker-compose -p "dev" down

# like devup, but forces a rebuild of the underlying images
.PHONY: devup-fbuild
devup-fbuild: gen-secret
	docker-compose -p "dev" -f docker/docker-compose.dev.yml up --build

.PHONY: devup-fbuild-nocache
devup-build-nocache:
	docker-compose -f ./docker/docker-compose.dev.yml build --no-cache

# BUILDING PRODUCTION SERVERS
# --------
.PHONY: produp
produp: gen-secret
	docker-compose -p "prod" -f docker/docker-compose.prod.yml up

.PHONY: produpd
produpd: gen-secret
	docker-compose -p "prod" -f docker/docker-compose.prod.yml up -d

.PHONY: proddown
proddown:
	docker-compose -p "prod" down

.PHONY: produp-fbuild
produp-fbuild: gen-secret
	docker-compose -p "prod" -f docker/docker-compose.prod.yml up --build

.PHONY: produp-fbuild-nocache
produp-build-nocache:
	docker-compose -f ./docker/docker-compose.prod.yml build --no-cache

# compile a production-optimized version of the client code
.PHONY: compile-client
compile-client: be/client/index.html

be/client/index.html: deps-fe
	(cd fe && npm run build && rm -rf ../be/client && mkdir ../be/client && cp -r build/ ../be/client)

# DEBUGGING DOCKER
# ------- below commands shouldn't be needed for building in 99% of cases. -------

# docker build the BE container for development
.PHONY: build-dev-be
build-dev-be: gen-secret
	docker build --file docker/dev.be.Dockerfile . -t dev.be

# docker run the BE container for development
.PHONY: run-dev-be
run-dev-be:
	docker run -i -t -p 8080:8080 dev.be

# docker build the FE container for development
.PHONY: build-dev-fe
build-dev-fe:
	docker build --file docker/dev.fe.Dockerfile . -t dev.fe

# docker run the FE container for development
.PHONY: run-dev-fe
run-dev-fe:
	docker run -i -t -p 3000:3000 dev.fe

# ADMINISTRATIVE
# -----------------------------------------------------------------------------
.PHONY: clean-deps
clean-deps:
	rm -rf venv fe/node_modules be/__pycache__
