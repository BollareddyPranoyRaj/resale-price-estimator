const { requestGeminiJson } = require('../lib/geminiApi');

function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeBrand(entry) {
  const name = String(entry?.name ?? '').trim();
  const slug = slugify(entry?.slug || name);

  if (!name || !slug) {
    return null;
  }

  return {
    slug,
    name,
    modelCount: Math.max(1, Math.round(toFiniteNumber(entry?.modelCount, 12))),
  };
}

function normalizeModel(entry) {
  const name = String(entry?.name ?? '').trim();
  const slug = slugify(entry?.slug || name);

  if (!name || !slug) {
    return null;
  }

  return {
    slug,
    name,
    launchPrice: Math.max(1, Math.round(toFiniteNumber(entry?.launchPrice, 50000))),
    releaseYear: clamp(Math.round(toFiniteNumber(entry?.releaseYear, new Date().getFullYear() - 2)), 2007, 2030),
    segment: String(entry?.segment ?? 'midrange').trim() || 'midrange',
  };
}

function normalizeEstimate(data, payload) {
  const originalPrice = Math.max(1, Math.round(toFiniteNumber(payload.originalPrice, data?.originalPrice)));
  const estimatedPrice = clamp(Math.round(toFiniteNumber(data?.estimatedPrice, originalPrice * 0.5)), 1, originalPrice);
  const minPrice = clamp(Math.round(toFiniteNumber(data?.minPrice, estimatedPrice * 0.9)), 1, estimatedPrice);
  const maxPrice = Math.max(estimatedPrice, Math.round(toFiniteNumber(data?.maxPrice, estimatedPrice * 1.1)));
  const depreciationPercent = clamp(
    Math.round(toFiniteNumber(data?.depreciationPercent, ((originalPrice - estimatedPrice) / originalPrice) * 100)),
    0,
    100
  );
  const retentionScore = clamp(Math.round(toFiniteNumber(data?.retentionScore, 100 - depreciationPercent)), 0, 100);
  const keyFactors = Array.isArray(data?.keyFactors)
    ? data.keyFactors.map((factor) => String(factor).trim()).filter(Boolean).slice(0, 6)
    : [];

  return {
    categoryLabel: 'Phones',
    brandLabel: data?.brandLabel || payload.brandName || payload.brandSlug,
    modelLabel: data?.modelLabel || payload.modelName || payload.modelSlug,
    brand: data?.brand || payload.brandName || payload.brandSlug,
    model: data?.model || payload.modelName || payload.modelSlug,
    originalPrice,
    ageInMonths: Math.round(toFiniteNumber(payload.ageInMonths, 0)),
    condition: payload.condition,
    estimatedPrice,
    minPrice,
    maxPrice,
    depreciationPercent,
    retentionScore,
    storage: data?.storage || payload.storage || 'standard',
    launchPrice: data?.launchPrice === null ? null : Math.round(toFiniteNumber(data?.launchPrice, originalPrice)),
    keyFactors: keyFactors.length
      ? keyFactors
      : [
          `Condition: ${payload.condition}`,
          `Age: ${payload.ageInMonths} months`,
          `Original price: Rs. ${originalPrice}`,
          'AI-generated estimate; verify against live market listings before final sale.',
        ],
  };
}

async function getGeminiPhoneBrands() {
  const response = await requestGeminiJson(`Return JSON only.
Create a concise phone resale brand catalog for India.
Return an object with a "brands" array of 12 popular phone brands.
Each brand must have: slug, name, modelCount.
Use URL-safe lowercase slugs.`);

  const brands = Array.isArray(response?.brands) ? response.brands.map(normalizeBrand).filter(Boolean) : [];
  return brands.length ? brands : [{ slug: 'apple', name: 'Apple', modelCount: 12 }];
}

async function getGeminiPhoneModels(brandSlug, searchQuery) {
  const searchContext = searchQuery 
    ? `The user searched for EXACTLY: "${searchQuery}". You MUST include this exact model in your results, even if it is a brand new 2025/2026 release (like iPhone 16 or S24 FE). Furthermore, generate 4-5 different storage variants of this exact model (e.g. "${searchQuery} 256GB", "${searchQuery} 512GB") as separate items in the array.` 
    : 'Make sure to include the absolute newest models released up to 2025 and 2026, as well as popular FE or Pro variants.';

  const response = await requestGeminiJson(`Return JSON only.
Create a phone resale model catalog for brand slug "${brandSlug}" in India.
Return an object with a "models" array of 5 to 10 real phone models.
${searchContext}
Each model must have: slug, name, launchPrice, releaseYear, segment.
launchPrice must be an approximate Indian launch price in INR.`);

  const models = Array.isArray(response?.models) ? response.models.map(normalizeModel).filter(Boolean) : [];
  return models.length ? models : [];
}

async function postGeminiPhoneEstimate(payload) {
  const response = await requestGeminiJson(`Return JSON only.
Estimate the resale value in INR for this used phone in India.
Be conservative and realistic. Use condition, age, repair history, accessories, warranty, and original price.
Return one object with exactly these fields:
brand, model, brandLabel, modelLabel, originalPrice, ageInMonths, condition, estimatedPrice, minPrice, maxPrice, depreciationPercent, retentionScore, storage, launchPrice, keyFactors.
keyFactors must be an array of 4 to 6 short strings.

Input:
${JSON.stringify(payload, null, 2)}`);

  return normalizeEstimate(response, payload);
}

module.exports = {
  getGeminiPhoneBrands,
  getGeminiPhoneModels,
  postGeminiPhoneEstimate,
};
