from app.main import bp


@bp.on_error()
def handle_websocket_error_default(e):
    print(e)
    return {"result": "error"}
