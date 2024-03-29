from flask import current_app
from flask_socketio import emit

CURRENT_ONLINE_USERS_KEY = "system:online_users"
USER_IS_ONLINE_KEY_PREFIX = "user:is_online:"
USER_ONLINE_KEEPALIVE_DURATION = 60


def send_number_online_users_to_all_clients(number_to_send):
    # XXX: as number of users scale, this will consume a lot of cpu and bandwidth!
    emit("connection-info-update", {"users": number_to_send}, broadcast=True)


def process_connect_from_user(uid):
    # TODO look into the accuracy of this: this will count open pages, and not
    # individual users
    number_users = current_app.redis.incr(CURRENT_ONLINE_USERS_KEY)
    current_app.redis.set(
        USER_IS_ONLINE_KEY_PREFIX + uid, 1, ex=USER_ONLINE_KEEPALIVE_DURATION
    )

    send_number_online_users_to_all_clients(number_users)


def process_disconnect_from_user(uid):
    number_users = current_app.redis.decr(CURRENT_ONLINE_USERS_KEY)
    current_app.redis.delete(USER_IS_ONLINE_KEY_PREFIX + uid)

    send_number_online_users_to_all_clients(number_users)


# TODO: passing in redis_client here (from create_app) is a TDD hack to be refactored
def reset_number_of_online_users(redis_client):
    redis_client.set(CURRENT_ONLINE_USERS_KEY, 0)
