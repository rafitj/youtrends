from app import app
from dotenv import load_dotenv
load_dotenv()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
