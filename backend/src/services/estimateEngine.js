const catalog = {
  phones: {
    label: 'Phones',
    baseRetention: 0.79,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.1, monthlyDepreciation: 0.018, floorRetention: 0.34 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.05, monthlyDepreciation: 0.022, floorRetention: 0.28 },
      { slug: 'xiaomi', name: 'Xiaomi', brandPremium: 0.02, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'redmi', name: 'Redmi', brandPremium: 0.015, monthlyDepreciation: 0.027, floorRetention: 0.22 },
      { slug: 'poco', name: 'Poco', brandPremium: 0.015, monthlyDepreciation: 0.027, floorRetention: 0.21 },
      { slug: 'realme', name: 'Realme', brandPremium: 0.012, monthlyDepreciation: 0.028, floorRetention: 0.2 },
      { slug: 'oppo', name: 'Oppo', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'vivo', name: 'Vivo', brandPremium: 0.017, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'oneplus', name: 'OnePlus', brandPremium: 0.04, monthlyDepreciation: 0.023, floorRetention: 0.25 },
      { slug: 'iqoo', name: 'iQOO', brandPremium: 0.018, monthlyDepreciation: 0.025, floorRetention: 0.22 },
      { slug: 'google-pixel', name: 'Google (Pixel)', brandPremium: 0.05, monthlyDepreciation: 0.021, floorRetention: 0.27 },
      { slug: 'motorola', name: 'Motorola', brandPremium: 0.016, monthlyDepreciation: 0.027, floorRetention: 0.21 },
      { slug: 'nokia', name: 'Nokia', brandPremium: 0.01, monthlyDepreciation: 0.029, floorRetention: 0.19 },
      { slug: 'nothing', name: 'Nothing', brandPremium: 0.03, monthlyDepreciation: 0.024, floorRetention: 0.24 },
      { slug: 'infinix', name: 'Infinix', brandPremium: 0.008, monthlyDepreciation: 0.03, floorRetention: 0.18 },
      { slug: 'tecno', name: 'Tecno', brandPremium: 0.008, monthlyDepreciation: 0.03, floorRetention: 0.18 },
      { slug: 'lava', name: 'Lava', brandPremium: 0.006, monthlyDepreciation: 0.031, floorRetention: 0.17 },
      { slug: 'micromax', name: 'Micromax', brandPremium: 0.006, monthlyDepreciation: 0.031, floorRetention: 0.17 },
      { slug: 'karbonn', name: 'Karbonn', brandPremium: 0.005, monthlyDepreciation: 0.032, floorRetention: 0.16 },
      { slug: 'jio', name: 'Jio', brandPremium: 0.005, monthlyDepreciation: 0.032, floorRetention: 0.16 },
      { slug: 'huawei', name: 'Huawei', brandPremium: 0.025, monthlyDepreciation: 0.024, floorRetention: 0.22 },
      { slug: 'honor', name: 'Honor', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.21 },
      { slug: 'sony', name: 'Sony', brandPremium: 0.02, monthlyDepreciation: 0.025, floorRetention: 0.22 },
      { slug: 'asus', name: 'Asus', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.21 },
      { slug: 'zte', name: 'ZTE', brandPremium: 0.01, monthlyDepreciation: 0.029, floorRetention: 0.19 },
    ],
  },
  laptops: {
    label: 'Laptops',
    baseRetention: 0.74,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.09, monthlyDepreciation: 0.015, floorRetention: 0.36 },
      { slug: 'dell', name: 'Dell', brandPremium: 0.04, monthlyDepreciation: 0.018, floorRetention: 0.27 },
      { slug: 'lenovo', name: 'Lenovo', brandPremium: 0.03, monthlyDepreciation: 0.019, floorRetention: 0.26 },
      { slug: 'hp', name: 'HP', brandPremium: 0.03, monthlyDepreciation: 0.019, floorRetention: 0.26 },
      { slug: 'asus', name: 'Asus', brandPremium: 0.028, monthlyDepreciation: 0.02, floorRetention: 0.25 },
      { slug: 'acer', name: 'Acer', brandPremium: 0.022, monthlyDepreciation: 0.021, floorRetention: 0.24 },
    ],
  },
  tablets: {
    label: 'Tablets',
    baseRetention: 0.72,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.08, monthlyDepreciation: 0.017, floorRetention: 0.33 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.04, monthlyDepreciation: 0.02, floorRetention: 0.27 },
      { slug: 'xiaomi', name: 'Xiaomi', brandPremium: 0.02, monthlyDepreciation: 0.022, floorRetention: 0.24 },
      { slug: 'lenovo', name: 'Lenovo', brandPremium: 0.02, monthlyDepreciation: 0.022, floorRetention: 0.24 },
    ],
  },
  accessories: {
    label: 'Accessories',
    baseRetention: 0.58,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.06, monthlyDepreciation: 0.024, floorRetention: 0.22 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.03, monthlyDepreciation: 0.026, floorRetention: 0.2 },
      { slug: 'sony', name: 'Sony', brandPremium: 0.04, monthlyDepreciation: 0.025, floorRetention: 0.21 },
      { slug: 'boat', name: 'boAt', brandPremium: 0.015, monthlyDepreciation: 0.028, floorRetention: 0.19 },
      { slug: 'other-accessories', name: 'Other Accessories', brandPremium: 0.01, monthlyDepreciation: 0.028, floorRetention: 0.18 },
    ],
  },
};

const CONDITIONS = ['excellent', 'good', 'fair', 'poor'];
const SCREEN_CONDITIONS = ['no scratches', 'minor', 'cracked'];
const BATTERY_CONDITIONS = ['good', 'average', 'poor'];
const USAGE_LEVELS = ['light', 'moderate', 'heavy'];
const REPAIR_LEVELS = ['no', 'minor', 'major'];

const conditionMultiplier = {
  excellent: 1.08,
  good: 1,
  fair: 0.86,
  poor: 0.68,
};

function getCategoryDefinition(categorySlug) {
  return catalog[categorySlug] ?? null;
}

function getBrandDefinition(categorySlug, brandName) {
  const category = getCategoryDefinition(categorySlug);
  if (!category || !brandName) {
    return null;
  }

  const normalizedName = String(brandName).trim().toLowerCase();
  return (
    category.brands.find(
      (brand) =>
        brand.slug === normalizedName || brand.name.toLowerCase() === normalizedName
    ) ?? null
  );
}

function validateEstimateInput(input) {
  const category = getCategoryDefinition(input.category);
  if (!category) {
    return 'Please choose a valid category.';
  }

  if (!Number.isFinite(input.originalPrice) || input.originalPrice <= 0) {
    return 'Original price must be a number greater than 0.';
  }

  if (!Number.isFinite(input.ageInMonths) || input.ageInMonths < 0) {
    return 'Age must be 0 months or more.';
  }

  if (!CONDITIONS.includes(input.condition)) {
    return 'Please choose a physical condition.';
  }

  if (!SCREEN_CONDITIONS.includes(input.conditionData?.screen)) {
    return 'Please choose a screen condition.';
  }

  if (!BATTERY_CONDITIONS.includes(input.conditionData?.battery)) {
    return 'Please choose a battery condition.';
  }

  if (!Number.isFinite(input.conditionData?.age) || input.conditionData.age < 0) {
    return 'Condition assessment age must be 0 months or more.';
  }

  if (!USAGE_LEVELS.includes(input.conditionData?.usage)) {
    return 'Please choose a usage intensity.';
  }

  if (!['yes', 'no'].includes(input.conditionData?.accessories)) {
    return 'Please choose whether original accessories are available.';
  }

  if (!REPAIR_LEVELS.includes(input.conditionData?.repairs)) {
    return 'Please choose the repair history.';
  }

  if (!['yes', 'no'].includes(input.conditionData?.warranty)) {
    return 'Please choose whether warranty is available.';
  }

  return '';
}

function estimateResale(input) {
  const category = getCategoryDefinition(input.category);
  const brand = getBrandDefinition(input.category, input.brandName);

  const brandPremium = brand?.brandPremium ?? 0.015;
  const monthlyDepreciation = brand?.monthlyDepreciation ?? 0.024;
  const floorRetention = brand?.floorRetention ?? 0.22;

  const ageFactor = Math.max(floorRetention, 1 - input.ageInMonths * monthlyDepreciation);

  const estimateBase =
    input.originalPrice *
    category.baseRetention *
    (1 + brandPremium) *
    conditionMultiplier[input.condition] *
    ageFactor;

  let conditionScore = 1;
  if (input.conditionData.physical === 'excellent') conditionScore += 0.05;
  if (input.conditionData.physical === 'poor') conditionScore -= 0.15;
  if (input.conditionData.screen === 'cracked') conditionScore -= 0.2;
  if (input.conditionData.battery === 'poor') conditionScore -= 0.15;
  if (input.conditionData.battery === 'good') conditionScore += 0.03;
  if (input.conditionData.usage === 'heavy') conditionScore -= 0.1;
  if (input.conditionData.accessories === 'yes') conditionScore += 0.03;
  if (input.conditionData.repairs === 'major') conditionScore -= 0.15;
  if (input.conditionData.warranty === 'yes') conditionScore += 0.05;
  conditionScore = Math.max(0.5, Math.min(1.2, conditionScore));

  const estimatedPrice = Math.max(500, Math.round(estimateBase * conditionScore));
  const spread = Math.max(1000, Math.round(estimatedPrice * 0.1));
  const minPrice = Math.max(300, estimatedPrice - spread);
  const maxPrice = estimatedPrice + spread;
  const depreciationPercent = Math.max(
    0,
    Math.min(95, Math.round(((input.originalPrice - estimatedPrice) / input.originalPrice) * 100))
  );
  const resaleScore = Math.max(
    20,
    Math.min(100, Math.round((estimatedPrice / input.originalPrice) * 100 + conditionMultiplier[input.condition] * 10))
  );
  const resolvedBrandLabel = brand?.name ?? input.brandName?.trim() ?? 'Custom Brand';
  const resolvedModelLabel = input.modelName?.trim() || 'Manual Model';

  return {
    ...input,
    categoryLabel: category.label,
    brandLabel: resolvedBrandLabel,
    modelLabel: resolvedModelLabel,
    estimatedPrice,
    minPrice,
    maxPrice,
    depreciationPercent,
    resaleScore,
    keyFactors: [
      `Brand: ${resolvedBrandLabel}`,
      `Model: ${resolvedModelLabel}`,
      `Condition: ${capitalize(input.condition)}`,
      `Age: ${input.ageInMonths} months`,
      `Screen: ${capitalizeWords(input.conditionData.screen)}`,
      `Battery: ${capitalize(input.conditionData.battery)}`,
      `Usage: ${capitalize(input.conditionData.usage)}`,
      `Accessories: ${capitalize(input.conditionData.accessories)}`,
      `Repairs: ${capitalize(input.conditionData.repairs)}`,
      `Warranty: ${capitalize(input.conditionData.warranty)}`,
      'Brand-based manual model estimation',
    ],
  };
}

function capitalize(value) {
  return value[0].toUpperCase() + value.slice(1);
}

function capitalizeWords(value) {
  return value
    .split(' ')
    .map((part) => capitalize(part))
    .join(' ');
}

module.exports = {
  CONDITIONS,
  validateEstimateInput,
  estimateResale,
};
