# Resale App Backend

Express REST API proxy for phone brand, model, and estimate requests.

## Run

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

Set `UPSTREAM_API_BASE_URL` to the production catalog and estimation API before starting the
server. The backend does not include embedded business data or local estimation logic.

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
