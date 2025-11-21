# staffmonitr

Multi-tenant staff, assignment, and scheduling visibility for highly regulated facilities. The React + Tailwind client talks to a Flask + SQLAlchemy API that ships audit-ready exports, ratio-tracking dashboards, and first-class OpenAPI docs without forcing you into containers during local work.

## Architecture snapshot
1. **Frontend:** React 19 + Vite, Tailwind, Zustand, and React Query keep optimistic shift assignments in sync while respecting account theming.
2. **Backend:** Flask API with SQLAlchemy models, account-group aware filtering, invitation/SSO scaffolding, and helper services for notifications, geofencing, and exports.
3. **Contracts:** `openapi.yaml` in the repo and `/api/docs` expose the spec so clients and tests share the same contract.
4. **Ops:** `Procfile` (gunicorn) plus optional Render descriptors in `ops/` let you deploy on any host without relying on Docker for dev workflows.

## Security & secrets

- Never commit real credentials. Copy `.env.example` to `.env` in the repository root for the backend, and provide a minimal `client/.env` with the values listed below before launching the UI.
- Rotate `SECRET_KEY`, `MAIL_SENDER`, and `DATABASE_URL` with each personnel change; inspect git history if you ever commit secrets by accident.
- Backend services read their configuration via `python-dotenv`, so any `.env` file at the project root is loaded automatically when the Flask app starts.

## Environment configuration

| Variable | Location | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `.env` | SQLAlchemy connection string. Defaults to SQLite (`sqlite:///staffmonitr.db`) for quick local prototyping. |
| `SECRET_KEY` | `.env` | Flask session/CSRF secret. Must be unique per deployment. |
| `MAIL_SENDER` | `.env` | From address for notification emails. |
| `JWT_EXPIRY_HOURS` | `.env` | Controls invitation and session token lifetime (default `8`). |
| `SSO_DOMAINS` | `.env` | Comma-separated domains allowed for SSO flows. |
| `VITE_API_URL` | `client/.env` | Base path used by the Vite client when the API is hosted separately (defaults to `/api`). |
| `VITE_DEFAULT_STAFF_ID` | `client/.env` | Optional fallback staff identifier used in shift request flows for optimistic UI demos. |

> Copy `.env.example` → `.env` before running the backend locally, and never commit the populated file.

## Getting started (no Docker)

### Prerequisites

1. Install Python 3.13 (per `server/Pipfile`) and Node 20+ (for the client).
2. `python -m pip install --upgrade pip` plus the tools you prefer (`virtualenv`, `pipenv`, etc.).

### Server

```bash
cd staffmonitr
python -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt -r server/requirements-dev.txt
cp .env.example .env  # add secrets used in tests/seed
flask --app server.app run --reload --port 5000
```

- The Flask app listens on `http://127.0.0.1:5000` by default and exposes `/api` routes plus `/api/docs` for the OpenAPI spec.
- When you need sample data, run `python -m server.seed` (with the virtualenv active) before hitting the client.
- The production `Procfile` already runs `gunicorn server.app:app --worker-class=gthread --threads 4 --timeout 120`, so mirror that command if you host the backend elsewhere.

### Client

```bash
cd staffmonitr/client
npm install
cat <<'EOF' > .env
VITE_API_URL=http://127.0.0.1:5000/api
EOF
npm run dev
```

- Vite runs on `http://127.0.0.1:5173` by default and proxies `/api/*` to the backend when `VITE_API_URL` is set.
- The dev proxy now targets `http://127.0.0.1:5000`, so keep Flask running on that port or set `VITE_DEV_API_URL` before `npm run dev` if you run the API somewhere else.
- Run `npm run build` before deploying, then either host the `client/dist` inside the Flask `static/` folder or serve it from a static host with `VITE_API_URL` pointing to the live API.

## Authentication & owner workflows

- **Sign in / sign up:** `/signin` now posts to `/api/auth/login`, stores the JWT, and keeps the axios client authorized for every request. `/signup` creates an owner admin, a tenant account, and immediately returns the access token so you land on the dashboard after onboarding.
- **Owner admin team management:** The dashboard surfaces a *Team* panel when your role is `Owner_admin`. Use that form to create staff or admin accounts scoped to your current account group; the backend now guards `/api/accounts/<account_id>/staff` so only the owner admin tied to that account can add members.
- **Tokens & session:** The client reads the saved JWT from `localStorage`, refreshes `/api/auth/me` on startup, and publishes the available account groups via the account context. Logging out removes the token and bumps you back to `/signin`.

## Testing & quality gates

- Backend: `cd staffmonitr && `.venv/bin/pytest` runs `server/tests/test_routes.py`. The tests use an isolated SQLite database and only depend on the Flask factory.
- Frontend: `npm run lint` (from `staffmonitr/client`) checks the React/TypeScript tree with ESLint.
- The client and server remain intentionally decoupled so you can run either suite independently.

## Deployment & operations

- Render-friendly descriptors live in `ops/render.yaml`, but production deployments can also honor the `Procfile` to start `gunicorn` directly.
- For static hosting of the SPA, build with `npm run build` and publish `client/dist`. Make sure the backend knows where to send CORS headers when the public origin differs.
- Keep the OpenAPI spec (`openapi.yaml`) in sync with any manual route updates; clients read `/api/docs` for the same file in runtime.

## Next steps

1. Plug real SMTP/push providers in `server/services/notifications.py` and wire their keys to your secret manager.
2. Seed production-ready assignment and geofence data by extending `server/seed.py` or importing via `server/routes/imports.py`.
3. Tie `VITE_DEFAULT_STAFF_ID` and `VITE_API_URL` to your production environment so staff dashboards can hydrate with realistic permission data without manual overrides.
# carmonitr
# staffmonitr
