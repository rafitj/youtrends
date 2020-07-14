from flask import session, redirect
from functools import wraps


def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = dict(session).get('profile', None)
        print(dict(session))
        if user:
            return f(*args, **kwargs)
        return "Unauthorized"
    return decorated_function
