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

async function getPhoneModels(brandSlug) {
  if (modelsCache.has(brandSlug)) {
    return modelsCache.get(brandSlug);
  }

  if (!hasUpstreamApi()) {
    const models = await getGeminiPhoneModels(brandSlug);
    modelsCache.set(brandSlug, models);
    return models;
  }

  const response = await requestUpstream(`/phones/brands/${encodeURIComponent(brandSlug)}/models`);
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
