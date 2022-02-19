In addition to the instructions in README.md, note the following:

- eventlet=0.30.2 is used, which is not the latest version due to a bug introduced with Gunicorn.
  - This introduces a potential vulnerability. See https://stackoverflow.com/questions/67409452/gunicorn-importerror-cannot-import-name-already-handled-from-eventlet-wsgi
- gunicorn needs to be ran with an asychronous worker to support websocket connections. See https://docs.gunicorn.org/en/stable/design.html
