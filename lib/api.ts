import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export type EstimateCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type ScreenCondition = 'no scratches' | 'minor' | 'cracked';
export type BatteryCondition = 'good' | 'average' | 'poor';
export type UsageIntensity = 'light' | 'moderate' | 'heavy';
export type RepairHistory = 'no' | 'minor' | 'major';

export type EstimateConditionData = {
  physical: EstimateCondition | null;
  screen: ScreenCondition | null;
  battery: BatteryCondition | null;
  age: number;
  usage: UsageIntensity | null;
  accessories: 'yes' | 'no' | null;
  repairs: RepairHistory | null;
  warranty: 'yes' | 'no' | null;
};

export type EstimateRequest = {
  brandName?: string;
  brandSlug?: string;
  modelName?: string;
  modelSlug?: string;
  originalPrice: number;
  ageInMonths: number;
  condition: EstimateCondition | null;
  conditionData: EstimateConditionData;
};

export type EstimateResult = {
  categoryLabel: string;
  brandLabel: string;
  modelLabel: string;
  originalPrice: number;
  ageInMonths: number;
  condition: string;
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  depreciationPercent: number;
  resaleScore: number;
  keyFactors: string[];
  storage?: string;
  launchPrice?: number | null;
};

export type PhoneBrand = {
  slug: string;
  name: string;
  modelCount: number;
};

export type PhoneModel = {
  slug: string;
  name: string;
  launchPrice: number;
  releaseYear: number;
  segment: string;
};

type ApiEnvelope<T> = {
  data: T;
  error?: string;
  message?: string;
};

type PhoneEstimateResponse = {
  categoryLabel?: string;
  brandLabel?: string;
  modelLabel?: string;
  brand: string;
  model: string;
  originalPrice: number;
  ageInMonths: number;
  condition: string;
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  depreciationPercent: number;
  retentionScore: number;
  storage: string;
  launchPrice: number | null;
  keyFactors?: string[];
};

export function getApiBaseUrl() {
  if (envBaseUrl) {
    return envBaseUrl;
  }

  const expoHostUri = Constants.expoConfig?.hostUri;
  const expoHost = expoHostUri?.split(':')[0];

  if (expoHost) {
    return `http://${expoHost}:5000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://127.0.0.1:5000/api';
}

export async function getPhoneBrands() {
  const response = await requestJson<PhoneBrand[]>('/phones/brands');
  return response.data;
}

export async function getPhoneModels(brandSlug: string) {
  const response = await requestJson<PhoneModel[]>(`/phones/brands/${brandSlug}/models`);
  return response.data;
}

export async function postEstimate(payload: EstimateRequest): Promise<EstimateResult> {
  const response = await requestJson<PhoneEstimateResponse>('/phones/estimate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapPhoneEstimate(response.data);
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      `Could not reach the backend API at ${getApiBaseUrl()}. Start the backend server or update EXPO_PUBLIC_API_BASE_URL.`
    );
  }

  const rawBody = await response.text();
  const data = rawBody ? safeParseJson(rawBody) : null;

  if (!response.ok) {
    throw new Error(
      data?.error ??
        data?.message ??
        `Backend request failed (${response.status}). Check that the API server is running.`
    );
  }

  if (!data || data.data === undefined) {
    throw new Error(`Backend returned an empty response from ${getApiBaseUrl()}.`);
  }

  return data as ApiEnvelope<T>;
}

function mapPhoneEstimate(data: PhoneEstimateResponse): EstimateResult {
  const defaultKeyFactors = [
    `Brand: ${data.brand}`,
    `Model: ${data.model}`,
    `Condition: ${capitalize(data.condition)}`,
    `Age: ${data.ageInMonths} months`,
    `Storage: ${data.storage}`,
  ];

  if (data.launchPrice) {
    defaultKeyFactors.push(`Launch price: Rs. ${data.launchPrice}`);
  }

  return {
    categoryLabel: data.categoryLabel ?? 'Phones',
    brandLabel: data.brandLabel ?? data.brand,
    modelLabel: data.modelLabel ?? data.model,
    originalPrice: data.originalPrice,
    ageInMonths: data.ageInMonths,
    condition: data.condition,
    estimatedPrice: data.estimatedPrice,
    minPrice: data.minPrice,
    maxPrice: data.maxPrice,
    depreciationPercent: data.depreciationPercent,
    resaleScore: data.retentionScore,
    storage: data.storage,
    launchPrice: data.launchPrice,
    keyFactors: data.keyFactors?.length ? data.keyFactors : defaultKeyFactors,
  };
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}
