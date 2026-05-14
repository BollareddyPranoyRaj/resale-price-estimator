# Resale App Backend

Express REST API proxy for phone brand, model, and estimate requests.

## Run

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

Set one of these backend-only environment variables before starting the server:

- `UPSTREAM_API_BASE_URL`: forwards catalog and estimate requests to your production API.
- `GEMINI_API_KEY`: uses Gemini to generate catalog suggestions and AI resale estimates when no
  upstream API is configured.

Optional:

- `GEMINI_MODEL`: defaults to `gemini-2.5-flash`.

Do not put `GEMINI_API_KEY` in the Expo frontend or any `EXPO_PUBLIC_*` variable.

## Endpoints

### `GET /api/health`

Health check endpoint.

### `GET /api/phones/brands`

Returns supported phone brands from the upstream API.

### `GET /api/phones/brands/:brandSlug/models`

Returns the models for a phone brand from the upstream API.

### `POST /api/phones/estimate`

Phone-specific estimate endpoint proxied to the upstream API.

Example request:

```json
{
  "brandSlug": "apple",
  "brandName": "Apple",
  "modelSlug": "iphone-13",
  "modelName": "iPhone 13",
  "originalPrice": 59900,
  "ageInMonths": 24,
  "condition": "good",
  "conditionData": {
    "physical": "good",
    "screen": "no scratches",
    "battery": "good",
    "age": 24,
    "usage": "moderate",
    "accessories": "yes",
    "repairs": "no",
    "warranty": "no"
  }
}
```
