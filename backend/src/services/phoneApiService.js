const { requestUpstream } = require('../lib/upstreamApi');

async function getPhoneBrands() {
  const response = await requestUpstream('/phones/brands');
  return response.data;
}

async function getPhoneModels(brandSlug) {
  const response = await requestUpstream(`/phones/brands/${encodeURIComponent(brandSlug)}/models`);
  return response.data;
}

async function postPhoneEstimate(payload) {
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
