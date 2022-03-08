All contributions to this project are welcome and will be greatly appreciated. This file includes what you need to do in order to be able to contribute code to strate.gg.

# Terminology

`BE` is the back-end API build with Flask, `FE` is the web UI built with react.

# Installing Dependencies

You'll need `git`, `Docker`, and `python` (>=3.7), and `make` installed on your machine.

`make deps` installs all dependencies. Specifically, it:

1. Sets up a python3 venv under `venv`
2. Downloads `requirements.txt` and `requirements-dev.txt`
3. Sets up `pre-commit` by attaching it to your git pre-commit hooks.
4. Downloads all `fe/` dependencies using `npm ci` (exact versions from
   `package-lock.json`)

# Building

## Development Build

The development environment is fully reproducible using docker. The
Docker configuration files live in `docker/`, though you don't need
to touch that if you are not doing anything docker-specific. Use the
below commands:

`make devup` composes up a development container. Both the BE and FE are
hot-reloaded with their respective servers. The website is available at
port 80 (default for HTTP), therefore, going to `localhost` should bring
up the app after all services are up.

By default, `make devup` runs docker compose up without the `-d` flag,
meaning that the output will be streamed to your terminal. If you want
the detached mode (container runs in the background, you get your
terminal), use `make devupd` (with a `d` in the end).

Use `make devdown` from any terminal to shut down the development server.

Use `make devup-fbuild` for a forced dev rebuild, `make devup-build-nocache`
to re-build without the cache.

## Production Build

`make produp` runs a production container and exposes it at port 80.

Use `make produpd` for detached mode, `make produp-fbuild` for a forced
rebuild, `make produp-build-nocache` to re-build without the cache.

`make proddown` shuts the production container down.

# Tests

The goal of testing within this project is to **allow code to be
refactored without fear**. Therefore, **tests should protect all user
facing functionality**, and _other developers working on the repo are
also users of your code_.

`make test` runs tests for the BE.

# Pre-commit Checks

It is required that all code changes pass the checks defined in the [pre-commit configuration file](.pre-commit-config.yaml). These checks include linting and auto-formatting for both the FE and BE codebases, among other utilities.

All PRs will automatically be checked to see if they pass all hooks. The best way to make sure that this will happen is to run pre-commit yourself.

Pre-commit should already be installed if you ran `make deps` (see [installing](#installing) above). Use `make install-commit-hooks` to automatically run all checks
before each commit.

`make check` will run a check as if you tried to commit (only staged files). `make check-all` will run pre-commit on all files.

## Recommended Plugins to Help You Pass Pre-commit

[HACKING.md](HACKING.md) describes recommended code editor setup for a more enjoyable development experience. These include setting up linting and auto-formatting on save so that you can resolve commit blockers faster.

# Code of Conduct

Be kind.
