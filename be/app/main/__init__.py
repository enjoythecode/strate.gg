from app.utils import IOBlueprint

bp = IOBlueprint("main", __name__)

from app.main import main_websocket  # noqa: F401,E402
from app.main import main_routes  # noqa: F401,E402
from app.main import debug_routes  # noqa: F401,E402
from app.main import error_handling  # noqa: F401,E402
