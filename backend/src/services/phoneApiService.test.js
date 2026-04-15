const test = require('node:test');
const assert = require('node:assert/strict');

const { getPhoneBrands, getPhoneModels, postPhoneEstimate } = require('./phoneApiService');

test.afterEach(() => {
  delete process.env.UPSTREAM_API_BASE_URL;
  global.fetch = undefined;
});

test('getPhoneBrands fetches the upstream brand endpoint', async () => {
  process.env.UPSTREAM_API_BASE_URL = 'https://upstream.example/api';
  global.fetch = async (url) => {
    assert.equal(url, 'https://upstream.example/api/phones/brands');

    return new Response(
      JSON.stringify({
        data: [{ slug: 'apple', name: 'Apple', modelCount: 10 }],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  };

  const brands = await getPhoneBrands();

  assert.deepEqual(brands, [{ slug: 'apple', name: 'Apple', modelCount: 10 }]);
});

test('getPhoneModels fetches the upstream model endpoint', async () => {
  process.env.UPSTREAM_API_BASE_URL = 'https://upstream.example/api';
  global.fetch = async (url) => {
    assert.equal(url, 'https://upstream.example/api/phones/brands/apple/models');

    return new Response(
      JSON.stringify({
        data: [{ slug: 'iphone-15', name: 'iPhone 15', launchPrice: 79900, releaseYear: 2023, segment: 'premium' }],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  };

  const models = await getPhoneModels('apple');

  assert.equal(models[0].slug, 'iphone-15');
});

test('postPhoneEstimate sends payloads to the upstream estimate endpoint', async () => {
  process.env.UPSTREAM_API_BASE_URL = 'https://upstream.example/api';
  global.fetch = async (url, init) => {
    assert.equal(url, 'https://upstream.example/api/phones/estimate');
    assert.equal(init?.method, 'POST');

    const payload = JSON.parse(init?.body ?? '{}');
    assert.equal(payload.brandSlug, 'apple');
    assert.equal(payload.modelSlug, 'iphone-15');

    return new Response(
      JSON.stringify({
        data: {
          brand: 'Apple',
          model: 'iPhone 15',
          originalPrice: 79900,
          ageInMonths: 12,
          condition: 'good',
          estimatedPrice: 52000,
          minPrice: 50000,
          maxPrice: 54000,
          depreciationPercent: 35,
          retentionScore: 65,
          storage: '128GB',
          launchPrice: 79900,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  };

  const result = await postPhoneEstimate({
    brandSlug: 'apple',
    modelSlug: 'iphone-15',
    originalPrice: 79900,
    ageInMonths: 12,
    condition: 'good',
    conditionData: {
      physical: 'good',
      screen: 'no scratches',
      battery: 'good',
      age: 12,
      usage: 'moderate',
      accessories: 'yes',
      repairs: 'no',
      warranty: 'no',
    },
  });

  assert.equal(result.estimatedPrice, 52000);
});
