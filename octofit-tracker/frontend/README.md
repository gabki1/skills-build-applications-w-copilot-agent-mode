# Octofit Tracker Frontend

This React 19 presentation tier uses React Router for navigation and fetches data from the backend API using Vite environment variables.

## Environment configuration

Define VITE_CODESPACE_NAME in a local environment file before starting the app in GitHub Codespaces.

Example:

```bash
cp .env.local.example .env.local
```

Then update .env.local with your Codespace name, for example:

```dotenv
VITE_CODESPACE_NAME=my-codespace
```

If VITE_CODESPACE_NAME is not defined, the app falls back to http://127.0.0.1:8000 for local development.
