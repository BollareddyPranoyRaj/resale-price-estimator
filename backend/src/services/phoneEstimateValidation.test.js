const test = require('node:test');
const assert = require('node:assert/strict');

const { validatePhoneEstimateInput } = require('./phoneEstimateValidation');

test('validatePhoneEstimateInput requires API-selected brand and model identifiers', () => {
  const message = validatePhoneEstimateInput({
    brandSlug: 'apple',
    modelSlug: null,
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

  assert.equal(message, 'modelSlug is required.');
});
