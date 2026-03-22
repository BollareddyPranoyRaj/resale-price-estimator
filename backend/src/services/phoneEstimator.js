const {
  getBrandByName,
  getBrandBySlug,
  getPhoneModel,
} = require('../repositories/phoneCatalogRepository');

const CONDITIONS = ['excellent', 'good', 'fair', 'poor'];

const conditionMultiplier = {
  excellent: 1.08,
  good: 1,
  fair: 0.86,
  poor: 0.68,
};

const storageMultiplier = {
  '64GB': 0.97,
  '128GB': 1,
  '256GB': 1.05,
  '512GB': 1.1,
  '1TB': 1.14,
};

const SCREEN_CONDITIONS = ['no scratches', 'minor', 'cracked'];
const BATTERY_CONDITIONS = ['good', 'average', 'poor'];
const USAGE_LEVELS = ['light', 'moderate', 'heavy'];
const REPAIR_LEVELS = ['no', 'minor', 'major'];

const genericProfile = {
  baseRetention: 0.67,
  monthlyDepreciation: 0.024,
  floorRetention: 0.22,
  brandPremium: 0.01,
};

function validatePhoneEstimateInput(input) {
  if (!input.brandName && !input.brandSlug) {
    return 'brandName or brandSlug is required.';
  }

  if (!Number.isFinite(input.ageInMonths) || input.ageInMonths < 0) {
    return 'ageInMonths must be 0 or greater.';
  }

  if (!CONDITIONS.includes(input.condition)) {
    return 'condition must be one of: excellent, good, fair, poor.';
  }

  if (!Number.isFinite(input.originalPrice) || input.originalPrice <= 0) {
    return 'originalPrice must be greater than 0.';
  }

  if (input.storage !== undefined && !storageMultiplier[input.storage]) {
    return 'storage must be one of: 64GB, 128GB, 256GB, 512GB, 1TB.';
  }

  if (!CONDITIONS.includes(input.conditionData?.physical)) {
    return 'physical condition must be one of: excellent, good, fair, poor.';
  }

  if (!SCREEN_CONDITIONS.includes(input.conditionData?.screen)) {
    return 'screen condition must be one of: no scratches, minor, cracked.';
  }

  if (!BATTERY_CONDITIONS.includes(input.conditionData?.battery)) {
    return 'battery condition must be one of: good, average, poor.';
  }

  if (!Number.isFinite(input.conditionData?.age) || input.conditionData.age < 0) {
    return 'conditionData.age must be 0 or greater.';
  }

  if (!USAGE_LEVELS.includes(input.conditionData?.usage)) {
    return 'usage must be one of: light, moderate, heavy.';
  }

  if (!['yes', 'no'].includes(input.conditionData?.accessories)) {
    return 'accessories must be yes or no.';
  }

  if (!REPAIR_LEVELS.includes(input.conditionData?.repairs)) {
    return 'repairs must be one of: no, minor, major.';
  }

  if (!['yes', 'no'].includes(input.conditionData?.warranty)) {
    return 'warranty must be yes or no.';
  }

  return '';
}

function estimatePhoneResale(input) {
  const brand =
    (input.brandSlug ? getBrandBySlug(input.brandSlug) : null) ??
    (input.brandName ? getBrandByName(input.brandName) : null);

  const knownModel = brand
    ? getPhoneModel(brand.slug, input.modelSlug ?? input.modelName ?? '')
    : null;

  const profile = brand?.depreciationProfile ?? genericProfile;
  const sourcePrice = input.originalPrice;
  const ageFactor = Math.max(
    profile.floorRetention,
    1 - input.ageInMonths * profile.monthlyDepreciation
  );
  const conditionFactor = conditionMultiplier[input.condition];
  const storageFactor = input.storage ? storageMultiplier[input.storage] : 1;
  const modelFactor = 1 + (knownModel?.model.modelRetentionBoost ?? 0);
  const brandFactor = 1 + profile.brandPremium;
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

  const estimatedPrice = Math.max(
    1500,
    Math.round(
      sourcePrice *
        profile.baseRetention *
        ageFactor *
        conditionFactor *
        storageFactor *
        modelFactor *
        brandFactor *
        conditionScore
    )
  );
  const spread = Math.max(1200, Math.round(estimatedPrice * 0.1));
  const minPrice = Math.max(1000, estimatedPrice - spread);
  const maxPrice = estimatedPrice + spread;
  const depreciationPercent = Math.max(
    0,
    Math.min(95, Math.round(((sourcePrice - estimatedPrice) / sourcePrice) * 100))
  );
  const retentionScore = Math.max(20, Math.min(100, Math.round((estimatedPrice / sourcePrice) * 100)));

  return {
    category: 'electronics',
    itemType: 'phone',
    brand: brand?.name ?? input.brandName ?? 'Unknown Brand',
    brandSlug: brand?.slug ?? null,
    model: knownModel?.model.name ?? input.modelName ?? 'Custom Model',
    modelSlug: knownModel?.model.slug ?? null,
    launchPrice: knownModel?.model.launchPrice ?? null,
    originalPrice: sourcePrice,
    ageInMonths: input.ageInMonths,
    condition: input.condition,
    conditionData: input.conditionData,
    storage: input.storage ?? '128GB',
    estimatedPrice,
    minPrice,
    maxPrice,
    depreciationPercent,
    retentionScore,
    appliedRules: {
      baseRetention: profile.baseRetention,
      monthlyDepreciation: profile.monthlyDepreciation,
      floorRetention: profile.floorRetention,
      brandPremium: profile.brandPremium,
      modelRetentionBoost: knownModel?.model.modelRetentionBoost ?? 0,
      conditionScore,
    },
  };
}

module.exports = {
  CONDITIONS,
  validatePhoneEstimateInput,
  estimatePhoneResale,
};
