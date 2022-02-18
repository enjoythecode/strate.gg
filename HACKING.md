This file explains on my preferred way of working on this codebase.

# Code Editor Plugins
I use VS Code, and all settings mentioned here are also available at the `.vscode/settings.json` file. That is also where VS Code looks for Workspace setting by default, so if you are on a fresh clone of the repo, VS Code should have picked these up automatically. You may need to the extensions below. Their purposes are explained further below.
- `esbenp.prettier-vscode`
- `dbaeumer.vscode-eslint`
- `ms-python.python`

## Auto-formatting JS with Prettier
Prettier is already a dev dependency. I recommend adding it to your code editor to run it automatically for you! [Find instructions here.](https://prettier.io/docs/en/editors.html)

For VS Code (which is what I use), the extension ID is `esbenp.prettier-vscode`.

These are settings that formats my files automatically on every JavaScript file save:

```
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false,
    "[javascript]": {
        "editor.formatOnSave": true
    }
```

## Linting JS with ESLint
Just like Prettier, ESLint is already a dependency. I recommend the `dbaeumer.vscode-eslint` extension. To make this extension work with the code structure of this project, add the following to your VS Code settings:

```
  "eslint.workingDirectories": [ "./fe"]
```

## Auto-formatting Python with Black
Similar to auto-formatting JS with Prettier.

You'll need to have the `black` package installed. This dependency is in `be/requirements.txt`, so you should already have it. The VS code extension needed is `ms-python.python`, and the settings to use are below:
```
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python"
  },
  "python.formatting.provider": "black"
```

## Linting Python with Flake8
Similar to all above. The Python dependency is `flake8`, which is in `be/requirements.txt`. The VS Code package is the same as above (`ms-python.python`).

Here are the settings:
```
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.linting.flake8Args": ["--ignore=E203", "--max-line-length=88"]
```

The Flake8 arguments (last setting) are for compatibility with `black` auto-formatting. [Read more in Black documentation.](https://black.readthedocs.io/en/stable/guides/using_black_with_other_tools.html#flake8)