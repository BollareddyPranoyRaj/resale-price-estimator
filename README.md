# Resale App

Expo frontend plus a local Express API proxy for phone resale workflows.

## Project Structure

- `app/`: Expo Router screens
- `lib/`: frontend API helpers and request validation
- `backend/`: Express API proxy and upstream integration layer

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
- `GET /api/phones/brands`
- `GET /api/phones/brands/:brandSlug/models`
- `POST /api/phones/estimate`

The backend no longer ships embedded business catalogs or local estimation formulas. Set
`UPSTREAM_API_BASE_URL` in the backend environment so brand, model, and estimate requests are
forwarded to your production data service.

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

## Deploy For Phone Testing

To install this app on a real phone without relying on your laptop each time:

1. Deploy the backend first.

Render is the simplest option in this repo because [render.yaml](/Users/bollareddypranoyraj/resale-app/render.yaml) is already included.

Your production backend URL will look like:

```bash
https://your-render-service.onrender.com/api
```

2. Create a local env file from the example:

```bash
cp .env.example .env
```

Then set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-render-service.onrender.com/api
```

3. Install EAS CLI and log in:

```bash
npm install -g eas-cli
eas login
```

4. Configure the Expo project if this is your first build:

```bash
eas build:configure
```

5. Build an installable phone app:

Preview build for direct phone install:

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

Production build for stores:

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

Notes:

- Android package: `com.bollareddypranoyraj.resaleapp`
- iOS bundle identifier: `com.bollareddypranoyraj.resaleapp`
- Expo Go is for development, but EAS builds are what you install on your phone for demos or store submission.

## Publish Checklist

Use [RELEASE.md](/Users/bollareddypranoyraj/resale-app/RELEASE.md:1) for the backend deploy, Expo environment setup, EAS build, and store submission flow.
