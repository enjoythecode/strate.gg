This file explains on my preferred way of working on this codebase.

# Code Editor Plugins
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