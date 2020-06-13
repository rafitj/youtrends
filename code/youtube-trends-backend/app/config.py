import os

SECRET_KEY = os.urandom(256)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# GCP CONFIG
LOCAL_SQLALCHEMY_DATABASE_URI = (
    'mysql+mysqldb://{nam}:{pas}@127.0.0.1:3306/{dbn}').format(
    nam=os.getenv("CLOUDSQL_USER"),
    pas=os.getenv("CLOUDSQL_PASSWORD"),
    dbn=os.getenv("CLOUDSQL_DATABASE"),
)

LIVE_SQLALCHEMY_DATABASE_URI = (
    'mysql+mysqldb://{nam}:{pas}@localhost/{dbn}?unix_socket=/cloudsql/{con}').format(
    nam=os.getenv("CLOUDSQL_USER"),
    pas=os.getenv("CLOUDSQL_PASSWORD"),
    dbn=os.getenv("CLOUDSQL_DATABASE"),
    con=os.getenv("CLOUDSQL_CONNECTION_NAME"),
)

if os.environ.get('GAE_INSTANCE'):
    SQLALCHEMY_DATABASE_URI = LIVE_SQLALCHEMY_DATABASE_URI
else:
    SQLALCHEMY_DATABASE_URI = LOCAL_SQLALCHEMY_DATABASE_URI
