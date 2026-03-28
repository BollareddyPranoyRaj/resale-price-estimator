# Resale App

Expo frontend plus a local Express API for resale-price estimates.

## Project Structure

- `app/`: Expo Router screens
- `lib/`: frontend API helpers, validation, and catalog helpers
- `backend/`: Express API, phone catalog, and estimation services

## Run The App

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Start the backend API:

```bash
cd backend
npm run dev
```

4. Start the Expo app in a separate terminal:

```bash
npm start
```

The frontend expects the API at `http://localhost:5000/api` by default.

## API Base URL

You can override the API base URL with:

```bash
EXPO_PUBLIC_API_BASE_URL=http://<your-host>:5000/api
```

If no env var is provided, the app resolves a local URL from Expo host info and falls back to:

- Android emulator: `http://10.0.2.2:5000/api`
- iOS simulator / local desktop: `http://127.0.0.1:5000/api`

## Main Endpoints

- `GET /api/health`
- `POST /api/estimates`
- `GET /api/phones/brands`
- `GET /api/phones/brands/:brandSlug/models`
- `POST /api/phones/estimate`

## Checks

Frontend lint:

```bash
npm run lint
```

Backend tests:

```bash
cd backend
npm test
```
