All contributions to this project are welcome and will be greatly appreciated. This file includes what you need to do in order to be able to contribute code to strate.gg.

# Pre-commit Checks

It is required that all code changes pass the checks defined in the [pre-commit configuration file](.pre-commit-config.yaml). These checks include linting and auto-formatting for both the FE and BE codebases, among other utilities.

All PRs will automatically be checked to see if they pass all hooks. The best way to make sure that this will happen is to run pre-commit yourself.

## Setting up Pre-commit

1. Install pre-commit: See [official instructions](https://pre-commit.com/#install). This will likely look something like:

```
pip install pre-commit
```

2. Set up pre-commit in the repository, tying it to Git.

```
pre-commit install
```

If everything went well, the hooks will run and print to the console whenever you `git commit`. You can also run pre-commit manually like so:

```
pre-commit run {hook-id} {--run-all}
```

`hook-id` is optional, it is used to run a specific hook only. Hook IDs can be found the in the [pre-commit configuration file](.pre-commit-config.yaml)

`--run-all` is an optional flag to run the hooks on all files. By default, pre-commit only runs the hooks on staged files.

## Recommended Plugins to Help You Pass Pre-commit

[HACKING.md](HACKING.md) describes recommended code editor setup for a more enjoyable development experience. These include setting up linting and auto-formatting on save so that you can resolve commit blockers faster.
