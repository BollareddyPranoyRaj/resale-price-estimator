const test = require('node:test');
const assert = require('node:assert/strict');

const { estimatePhoneResale, validatePhoneEstimateInput } = require('./phoneEstimator');
const {
  getBrandBySlug,
  getModelsByBrand,
} = require('../repositories/phoneCatalogRepository');

test('known phone models return a catalog-backed estimate', () => {
  const result = estimatePhoneResale({
    brandSlug: 'apple',
    brandName: 'Apple',
    modelSlug: 'iphone-15',
    modelName: 'iPhone 15',
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

  assert.equal(result.estimateSource, 'catalog');
  assert.equal(result.model, 'iPhone 15');
  assert.equal(result.launchPrice, 79900);
});

test('unknown phone models fall back to manual estimation', () => {
  const result = estimatePhoneResale({
    brandSlug: 'asus',
    brandName: 'Asus',
    modelName: 'ROG Phone X',
    originalPrice: 45999,
    ageInMonths: 10,
    condition: 'good',
    conditionData: {
      physical: 'good',
      screen: 'minor',
      battery: 'average',
      age: 10,
      usage: 'moderate',
      accessories: 'no',
      repairs: 'no',
      warranty: 'no',
    },
  });

  assert.equal(result.estimateSource, 'manual');
  assert.equal(result.model, 'ROG Phone X');
  assert.equal(result.launchPrice, null);
});

test('repository exposes catalog models for populated brands', () => {
  const brand = getBrandBySlug('asus');
  const models = getModelsByBrand('asus');

  assert.equal(brand?.name, 'Asus');
  assert.equal(Array.isArray(models), true);
  assert.equal(models?.length > 0, true);
  assert.equal(models?.[0]?.slug, 'rog-phone-8-pro');
});

test('phone estimate validation still requires complete condition data', () => {
  const message = validatePhoneEstimateInput({
    brandSlug: 'apple',
    modelSlug: 'iphone-15',
    originalPrice: 79900,
    ageInMonths: 12,
    condition: 'good',
    conditionData: {
      physical: 'good',
      screen: null,
      battery: 'good',
      age: 12,
      usage: 'moderate',
      accessories: 'yes',
      repairs: 'no',
      warranty: 'no',
    },
  });

  assert.equal(message, 'screen condition must be one of: no scratches, minor, cracked.');
});
