# Resale App Backend

Express REST API for resale estimates and phone catalog data.

## Run

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Endpoints

### `GET /api/health`

Health check endpoint.

### `POST /api/estimates`

Generic estimate endpoint used for categories such as laptops, tablets, and accessories.

Example request:

```json
{
  "category": "laptops",
  "brandName": "Apple",
  "modelName": "MacBook Air",
  "originalPrice": 89999,
  "ageInMonths": 18,
  "condition": "good",
  "conditionData": {
    "physical": "good",
    "screen": "no scratches",
    "battery": "good",
    "age": 18,
    "usage": "moderate",
    "accessories": "yes",
    "repairs": "no",
    "warranty": "no"
  }
}
```

### `GET /api/phones/brands`

Returns supported phone brands from the backend catalog.

### `GET /api/phones/brands/:brandSlug/models`

Returns the known models for a phone brand.

### `POST /api/phones/estimate`

Phone-specific estimate endpoint backed by the catalog.

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
