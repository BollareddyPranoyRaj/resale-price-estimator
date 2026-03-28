const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { app } = require('./server');

test('GET /api/health returns service metadata', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.service, 'resale-app-api');
});

test('POST /api/estimates returns a generic estimate result', async () => {
  const response = await request(app)
    .post('/api/estimates')
    .send({
      category: 'laptops',
      brandName: 'Apple',
      modelName: 'MacBook Air',
      originalPrice: 90000,
      ageInMonths: 18,
      condition: 'good',
      conditionData: {
        physical: 'good',
        screen: 'no scratches',
        battery: 'good',
        age: 18,
        usage: 'moderate',
        accessories: 'yes',
        repairs: 'no',
        warranty: 'no',
      },
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'Estimate calculated successfully.');
  assert.equal(response.body.data.categoryLabel, 'Laptops');
  assert.equal(response.body.data.brandLabel, 'Apple');
  assert.equal(response.body.data.modelLabel, 'MacBook Air');
  assert.equal(typeof response.body.data.estimatedPrice, 'number');
  assert.equal(Array.isArray(response.body.data.keyFactors), true);
});

test('POST /api/phones/estimate returns a phone estimate result', async () => {
  const response = await request(app)
    .post('/api/phones/estimate')
    .send({
      brandSlug: 'apple',
      brandName: 'Apple',
      modelSlug: 'iphone-13',
      modelName: 'iPhone 13',
      originalPrice: 59900,
      ageInMonths: 24,
      condition: 'good',
      conditionData: {
        physical: 'good',
        screen: 'no scratches',
        battery: 'good',
        age: 24,
        usage: 'moderate',
        accessories: 'yes',
        repairs: 'no',
        warranty: 'no',
      },
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'Phone estimate calculated successfully.');
  assert.equal(response.body.data.brand, 'Apple');
  assert.equal(response.body.data.model, 'iPhone 13');
  assert.equal(response.body.data.originalPrice, 59900);
  assert.equal(typeof response.body.data.retentionScore, 'number');
});

test('POST /api/estimates validates bad payloads', async () => {
  const response = await request(app)
    .post('/api/estimates')
    .send({
      category: 'laptops',
      brandName: 'Apple',
      modelName: 'MacBook Air',
      originalPrice: 0,
      ageInMonths: 18,
      condition: 'good',
      conditionData: {
        physical: 'good',
        screen: 'no scratches',
        battery: 'good',
        age: 18,
        usage: 'moderate',
        accessories: 'yes',
        repairs: 'no',
        warranty: 'no',
      },
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Original price must be a number greater than 0.');
});
