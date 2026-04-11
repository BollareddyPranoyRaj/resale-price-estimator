import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export type EstimateCategory = 'phones' | 'laptops' | 'tablets' | 'accessories';
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
  category: EstimateCategory;
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
  estimateSource?: 'catalog' | 'manual';
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

type GenericEstimateResponse = {
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
  estimateSource?: 'catalog' | 'manual';
};

type PhoneEstimateResponse = {
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
  estimateSource: 'catalog' | 'manual';
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
  if (payload.category === 'phones' && payload.brandSlug) {
    const response = await requestJson<PhoneEstimateResponse>('/phones/estimate', {
      method: 'POST',
      body: JSON.stringify({
        brandSlug: payload.brandSlug,
        brandName: payload.brandName,
        modelSlug: payload.modelSlug,
        modelName: payload.modelName,
        originalPrice: payload.originalPrice,
        ageInMonths: payload.ageInMonths,
        condition: payload.condition,
        conditionData: payload.conditionData,
      }),
    });

    return mapPhoneEstimate(response.data);
  }

  const response = await requestJson<GenericEstimateResponse>('/estimates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
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
  const launchPriceLine = data.launchPrice ? `Launch price: Rs. ${data.launchPrice}` : 'Manual phone estimate';

  return {
    categoryLabel: 'Phones',
    brandLabel: data.brand,
    modelLabel: data.model,
    originalPrice: data.originalPrice,
    ageInMonths: data.ageInMonths,
    condition: data.condition,
    estimatedPrice: data.estimatedPrice,
    minPrice: data.minPrice,
    maxPrice: data.maxPrice,
    depreciationPercent: data.depreciationPercent,
    resaleScore: data.retentionScore,
    estimateSource: data.estimateSource,
    storage: data.storage,
    launchPrice: data.launchPrice,
    keyFactors: [
      `Brand: ${data.brand}`,
      `Model: ${data.model}`,
      `Condition: ${capitalize(data.condition)}`,
      `Age: ${data.ageInMonths} months`,
      `Storage: ${data.storage}`,
      data.estimateSource === 'catalog' ? 'Catalog-backed phone model' : 'Manual phone model fallback',
      launchPriceLine,
    ],
  };
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}
