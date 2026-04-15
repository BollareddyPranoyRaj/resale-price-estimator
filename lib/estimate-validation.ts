import type {
  BatteryCondition,
  EstimateCondition,
  EstimateRequest,
  RepairHistory,
  ScreenCondition,
  UsageIntensity,
} from '@/lib/api';

export const physicalOptions: EstimateCondition[] = ['excellent', 'good', 'fair', 'poor'];
export const screenOptions: ScreenCondition[] = ['no scratches', 'minor', 'cracked'];
export const batteryOptions: BatteryCondition[] = ['good', 'average', 'poor'];
export const usageOptions: UsageIntensity[] = ['light', 'moderate', 'heavy'];
export const repairOptions: RepairHistory[] = ['no', 'minor', 'major'];
export const yesNoOptions = ['yes', 'no'] as const;

export function getValidationMessage(input: EstimateRequest) {
  if (!input.brandSlug) {
    return 'Please choose a phone brand from the API.';
  }

  if (!input.modelSlug) {
    return 'Please choose a phone model from the API.';
  }

  if (!Number.isFinite(input.originalPrice) || input.originalPrice <= 0) {
    return 'Original price must be a number greater than 0.';
  }

  if (!Number.isFinite(input.ageInMonths) || input.ageInMonths < 0) {
    return 'Age must be 0 months or more.';
  }

  if (!input.condition || !physicalOptions.includes(input.condition)) {
    return 'Please choose a physical condition.';
  }

  if (!input.conditionData.physical || !physicalOptions.includes(input.conditionData.physical)) {
    return 'Please choose a physical condition.';
  }

  if (!input.conditionData.screen || !screenOptions.includes(input.conditionData.screen)) {
    return 'Please choose a screen condition.';
  }

  if (!input.conditionData.battery || !batteryOptions.includes(input.conditionData.battery)) {
    return 'Please choose a battery condition.';
  }

  if (!Number.isFinite(input.conditionData.age) || input.conditionData.age < 0) {
    return 'Condition assessment age must be 0 months or more.';
  }

  if (!input.conditionData.usage || !usageOptions.includes(input.conditionData.usage)) {
    return 'Please choose a usage intensity.';
  }

  if (!input.conditionData.accessories || !yesNoOptions.includes(input.conditionData.accessories)) {
    return 'Please choose whether original accessories are available.';
  }

  if (!input.conditionData.repairs || !repairOptions.includes(input.conditionData.repairs)) {
    return 'Please choose the repair history.';
  }

  if (!input.conditionData.warranty || !yesNoOptions.includes(input.conditionData.warranty)) {
    return 'Please choose whether warranty is available.';
  }

  return '';
}
