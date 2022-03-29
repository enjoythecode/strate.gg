from app.main import bp


# TODO: logging: log useful error messages
# TODO: do not to a catch-all here (bad style/smelly!).
# instead, throw and catch specific errors
@bp.on_error()
def handle_websocket_error_default(e):

    return {"result": "error"}
