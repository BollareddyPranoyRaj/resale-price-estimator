# Resale App Backend

Phone-focused Express REST API for resale price estimates.

## Run

```bash
cd backend
npm install
npm run dev
```

The API runs by default at `http://localhost:5000`.

## Endpoints

### `GET /api/health`

Health check endpoint.

### `GET /api/phones/brands`

Returns all supported phone brands in the catalog database.

### `GET /api/phones/brands/:brandSlug/models`

Returns all models for a given brand.

### `POST /api/phones/estimate`

Request body:

```json
{
  "brandSlug": "apple",
  "modelSlug": "iphone-13",
  "ageInMonths": 24,
  "condition": "good",
  "storage": "128GB"
}
```

Response:

```json
{
  "message": "Phone estimate calculated successfully.",
  "data": {
    "category": "electronics",
    "itemType": "phone",
    "brand": "Apple",
    "brandSlug": "apple",
    "model": "iPhone 13",
    "modelSlug": "iphone-13",
    "launchPrice": 59900,
    "originalPrice": 59900,
    "ageInMonths": 24,
    "condition": "good",
    "storage": "128GB",
    "estimatedPrice": 31995,
    "minPrice": 28795,
    "maxPrice": 35195,
    "depreciationPercent": 47,
    "retentionScore": 53
  }
}
```
