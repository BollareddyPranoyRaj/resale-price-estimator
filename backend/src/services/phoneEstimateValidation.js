const CONDITIONS = ['excellent', 'good', 'fair', 'poor'];
const SCREEN_CONDITIONS = ['no scratches', 'minor', 'cracked'];
const BATTERY_CONDITIONS = ['good', 'average', 'poor'];
const USAGE_LEVELS = ['light', 'moderate', 'heavy'];
const REPAIR_LEVELS = ['no', 'minor', 'major'];

function validatePhoneEstimateInput(input) {
  if (!input.brandSlug) {
    return 'brandSlug is required.';
  }

  if (!input.modelSlug) {
    return 'modelSlug is required.';
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

module.exports = {
  CONDITIONS,
  validatePhoneEstimateInput,
};
