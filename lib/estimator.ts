import {
  conditions,
  getCategoryDefinition,
  type CategorySlug,
  type Condition,
} from '@/lib/catalog';

export type ScreenCondition = 'no scratches' | 'minor' | 'cracked';
export type BatteryCondition = 'good' | 'average' | 'poor';
export type UsageIntensity = 'light' | 'moderate' | 'heavy';
export type RepairHistory = 'no' | 'minor' | 'major';

export type ConditionData = {
  physical: Condition | null;
  screen: ScreenCondition | null;
  battery: BatteryCondition | null;
  age: number;
  usage: UsageIntensity | null;
  accessories: 'yes' | 'no' | null;
  repairs: RepairHistory | null;
  warranty: 'yes' | 'no' | null;
};

export type EstimateInput = {
  category: CategorySlug;
  brandName?: string;
  modelName?: string;
  originalPrice: number;
  ageInMonths: number;
  condition: Condition | null;
  conditionData: ConditionData;
};

export type EstimateResult = EstimateInput & {
  categoryLabel: string;
  brandLabel: string;
  modelLabel: string;
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  depreciationPercent: number;
  resaleScore: number;
  keyFactors: string[];
};

const conditionMultiplier: Record<Condition, number> = {
  excellent: 1.08,
  good: 1,
  fair: 0.86,
  poor: 0.68,
};

export function getValidationMessage(input: EstimateInput) {
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

  if (!input.condition || !conditions.includes(input.condition)) {
    return 'Please choose a physical condition.';
  }

  if (!input.conditionData.screen) {
    return 'Please choose a screen condition.';
  }

  if (!input.conditionData.battery) {
    return 'Please choose a battery condition.';
  }

  if (!Number.isFinite(input.conditionData.age) || input.conditionData.age < 0) {
    return 'Condition assessment age must be 0 months or more.';
  }

  if (!input.conditionData.usage) {
    return 'Please choose a usage intensity.';
  }

  if (!input.conditionData.accessories) {
    return 'Please choose whether original accessories are available.';
  }

  if (!input.conditionData.repairs) {
    return 'Please choose the repair history.';
  }

  if (!input.conditionData.warranty) {
    return 'Please choose whether warranty is available.';
  }

  return '';
}

export function estimateResalePrice(input: EstimateInput): EstimateResult {
  const validationMessage = getValidationMessage(input);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const category = getCategoryDefinition(input.category)!;
  const normalizedBrandName = (input.brandName ?? '').trim().toLowerCase();

  const brand =
    category.brands.find((entry) => entry.name.toLowerCase() === normalizedBrandName) ?? null;

  const brandPremium = brand?.brandPremium ?? 0.015;
  const monthlyDepreciation = brand?.monthlyDepreciation ?? 0.024;
  const floorRetention = brand?.floorRetention ?? 0.22;

  const ageFactor = Math.max(
    floorRetention,
    1 - input.ageInMonths * monthlyDepreciation
  );

  const estimateBase =
    input.originalPrice *
    category.baseRetention *
    (1 + brandPremium) *
    conditionMultiplier[input.condition!] *
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
    Math.min(100, Math.round((estimatedPrice / input.originalPrice) * 100 + conditionMultiplier[input.condition!] * 10))
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
      `Condition: ${capitalize(input.condition!)}`,
      `Age: ${input.ageInMonths} months`,
      `Screen: ${capitalizeWords(input.conditionData.screen!)}`,
      `Battery: ${capitalize(input.conditionData.battery!)}`,
      `Usage: ${capitalize(input.conditionData.usage!)}`,
      `Accessories: ${capitalize(input.conditionData.accessories!)}`,
      `Repairs: ${capitalize(input.conditionData.repairs!)}`,
      `Warranty: ${capitalize(input.conditionData.warranty!)}`,
      'Brand-based manual model estimation',
    ],
  };
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function capitalizeWords(value: string) {
  return value
    .split(' ')
    .map((part) => capitalize(part))
    .join(' ');
}
