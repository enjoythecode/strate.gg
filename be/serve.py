from app import create_app
from app import socketio

app = create_app()
socketio.run(app, host="0.0.0.0", port="8080")
