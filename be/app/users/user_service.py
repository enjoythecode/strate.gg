import base64
import uuid

from flask import session

SESSION_KEY_FOR_UID = "uid"


def get_uid_of_session_holder():
    if SESSION_KEY_FOR_UID not in session:
        setup_server_side_session_cookie()
    return session[SESSION_KEY_FOR_UID]


def get_realtime_challenges_of_user(uid):
    # TODO: this may not exist...
    # TODO: better create session with some default variables, probably!
    return session["games_playing"]


def add_realtimechallenge_to_user(cid):
    if "games_playing" in session and session["games_playing"]:
        session["games_playing"].append(cid)
        session.modified = True
    else:
        session["games_playing"] = [cid]


def setup_server_side_session_cookie():
    """
    dummy implementation that assigns all users a new UID (= user ID) (since there
    is no matching account (there isn't an account system yet), this is equivalent to a
    new anon user!)

    does not replace existing UID such that repeat visitors are identified the same
    until the cookie expires or they clear it.
    """
    # decode a b64 encoded UUID to original (if ever needed) as follows:
    # uuid.UUID(bytes=base64.b64decode("WgNqblksTomwoelTRw0vaQ=="))

    if SESSION_KEY_FOR_UID in session:
        pass  # note: might need to record some index to redis (sid <-> uid) later
    else:
        uid = base64.b64encode(uuid.uuid4().bytes).decode()
        session[SESSION_KEY_FOR_UID] = uid
