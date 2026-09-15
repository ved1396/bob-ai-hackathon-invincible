import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(env_path)

raw_db_url = os.environ.get('DATABASE_URL', '').strip()

def build_sqlalchemy_url(url: str):
    if not url:
        raise ValueError("DATABASE_URL environment variable is missing or empty")
    
    if url.startswith('postgresql://'):
        scheme, rest = url.split('://', 1)
        # Split on last @ to separate userinfo from hostinfo
        userinfo, hostinfo = rest.rsplit('@', 1)
        if ':' in userinfo:
            username, password = userinfo.split(':', 1)
        else:
            username = userinfo
            password = ''
        
        password = urllib.parse.unquote(password)
        
        if '/' in hostinfo:
            hostport, db_part = hostinfo.split('/', 1)
        else:
            hostport = hostinfo
            db_part = 'postgres'
            
        dbname = db_part.split('?', 1)[0]
        
        if ':' in hostport:
            host, port_str = hostport.split(':', 1)
            port = int(port_str)
        else:
            host = hostport
            port = 5432
            
        # Map direct IPv6 host to IPv4 Pooler if needed
        if 'db.nktnkixnvphuloabpjwb.supabase.co' in host:
            host = 'aws-0-ap-northeast-2.pooler.supabase.com'
            if username == 'postgres':
                username = 'postgres.nktnkixnvphuloabpjwb'
                
        return URL.create(
            drivername='postgresql+psycopg2',
            username=username,
            password=password,
            host=host,
            port=port,
            database=dbname,
            query={'sslmode': 'require'}
        )
    return url

db_url_obj = build_sqlalchemy_url(raw_db_url)
Base = declarative_base()

print(f"[GRIDGUARD DB] Connecting strictly to PostgreSQL database...")

engine = create_engine(
    db_url_obj,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={"connect_timeout": 15, "sslmode": "require"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
