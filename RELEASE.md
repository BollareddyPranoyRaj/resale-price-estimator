# Release Checklist

This app has two moving pieces:

- Expo / EAS mobile app
- Render-hosted backend API

Ship the backend first, then point the app build at the live API URL.

## 1. Backend

Create the Render service from [render.yaml](/Users/bollareddypranoyraj/resale-app/render.yaml:1).

After deploy, verify:

```bash
https://<your-render-service>.onrender.com/api/health
```

Your production API base URL should be:

```bash
https://<your-render-service>.onrender.com/api
```

## 2. Expo Environment

Set the production API URL before creating builds.

Local build setup:

```bash
cp .env.example .env
```

Then set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

If you use remote EAS builds, also set the same variable in Expo:

```bash
eas env:create --name EXPO_PUBLIC_API_BASE_URL --value https://<your-render-service>.onrender.com/api
```

## 3. Verify Before Build

Frontend:

```bash
npm run lint
```

Backend targeted unit tests:

```bash
cd backend
node --test src/services/phoneEstimator.test.js
```

## 4. Build

Preview builds for device testing:

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

Production builds:

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

## 5. Submit

Android:

```bash
eas submit --platform android --profile production
```

iOS:

```bash
eas submit --platform ios --profile production
```

## Notes

- Android package: `com.bollareddypranoyraj.resaleapp`
- iOS bundle identifier: `com.bollareddypranoyraj.resaleapp`
- EAS build channels are configured for `development`, `preview`, and `production`.
- Store metadata, screenshots, privacy policy, and account setup still need to be completed in Google Play Console / App Store Connect.
