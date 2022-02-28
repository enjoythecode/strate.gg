from app.utils import IOBlueprint

bp = IOBlueprint("challenges", __name__)

from app.challenges import challenge_websocket  # noqa: F401,E402
from app.challenges import challenge_service  # noqa: F401,E402
