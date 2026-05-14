const { requestUpstream } = require('../lib/upstreamApi');
const {
  getGeminiPhoneBrands,
  getGeminiPhoneModels,
  postGeminiPhoneEstimate,
} = require('./geminiPhoneService');

function hasUpstreamApi() {
  return Boolean(process.env.UPSTREAM_API_BASE_URL?.trim());
}

async function getPhoneBrands() {
  if (!hasUpstreamApi()) {
    return getGeminiPhoneBrands();
  }

  const response = await requestUpstream('/phones/brands');
  return response.data;
}

async function getPhoneModels(brandSlug) {
  if (!hasUpstreamApi()) {
    return getGeminiPhoneModels(brandSlug);
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
