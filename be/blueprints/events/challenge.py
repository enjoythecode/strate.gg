from ... import socketio
from ...services.challenge import create_challenge


@socketio.on("game-create")
def create_game(payload):

    new_challenge = create_challenge()

    # TODO: change FE to get the challenge data from response.data
    return {"result": "success", "data": new_challenge}
