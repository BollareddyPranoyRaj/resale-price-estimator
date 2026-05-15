const { requestUpstream } = require('../lib/upstreamApi');
const {
  getGeminiPhoneBrands,
  getGeminiPhoneModels,
  postGeminiPhoneEstimate,
} = require('./geminiPhoneService');

let brandsCache = null;
const modelsCache = new Map();

function hasUpstreamApi() {
  return Boolean(process.env.UPSTREAM_API_BASE_URL?.trim());
}

async function getPhoneBrands() {
  if (brandsCache) {
    return brandsCache;
  }

  if (!hasUpstreamApi()) {
    const brands = await getGeminiPhoneBrands();
    brandsCache = brands;
    return brands;
  }

  const response = await requestUpstream('/phones/brands');
  return response.data;
}

async function getPhoneModels(brandSlug, searchQuery = '') {
  const cacheKey = `${brandSlug}_${searchQuery}`.toLowerCase();

  if (modelsCache.has(cacheKey)) {
    return modelsCache.get(cacheKey);
  }

  if (!hasUpstreamApi()) {
    const models = await getGeminiPhoneModels(brandSlug, searchQuery);
    modelsCache.set(cacheKey, models);
    return models;
  }

  const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  const response = await requestUpstream(`/phones/brands/${encodeURIComponent(brandSlug)}/models${queryParam}`);
  return response.data;
}

async function postPhoneEstimate(payload) {
  if (!hasUpstreamApi()) {
    return postGeminiPhoneEstimate(payload);
  }

  const response = await requestUpstream('/phones/estimate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}

module.exports = {
  getPhoneBrands,
  getPhoneModels,
  postPhoneEstimate,
};
