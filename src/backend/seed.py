import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.seed import init_db

if __name__ == '__main__':
    force_reset = '--force' in sys.argv or '-f' in sys.argv
    print(f'[SEED CLI] Initializing PostgreSQL Database Schema & Tables (force={force_reset})...')
    init_db(force=force_reset)
