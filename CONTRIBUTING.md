# Contributing to GRIDGUARD AI

Thank you for your interest in contributing to **GRIDGUARD AI**!

## Development Guidelines

1. **Architecture & Persistence**:
   - PostgreSQL/Supabase is the single source of truth. SQLite or local mock state must NOT be used for persistent data.
   - All mutations must go through FastAPI backend routes and persist to PostgreSQL.

2. **Code Style**:
   - Frontend components must be written in clean React JavaScript/JSX.
   - Backend routes must use FastAPI with Pydantic validation schemas and SQLAlchemy ORM models.

3. **IBM Bob Assistant Integration**:
   - Any additions to IBM Bob Assistant must query real PostgreSQL telemetry and include structured executable actions when applicable.

4. **Testing & PR Checklist**:
   - Run `npm run build` in `src/frontend` to verify clean build without syntax errors.
   - Ensure backend starts cleanly via `uvicorn main:app` in `src/backend`.
   - Verify GitHub Actions workflow (`.github/workflows/validate.yml`) passes cleanly.
