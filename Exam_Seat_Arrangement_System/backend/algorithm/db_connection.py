import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

# Load .env from backend folder (adjust path if needed)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise Exception("DATABASE_URL not found in environment variables")

    result = urlparse(db_url)
    return psycopg2.connect(
        dbname=result.path[1:],  # remove leading '/'
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )
