const express = require('express');

const {
  getBrandBySlug,
  getBrands,
  getModelsByBrand,
} = require('../repositories/phoneCatalogRepository');
const {
  CONDITIONS,
  estimatePhoneResale,
  validatePhoneEstimateInput,
} = require('../services/phoneEstimator');

const router = express.Router();

router.get('/brands', (_req, res) => {
  return res.status(200).json({
    data: getBrands(),
  });
});

router.get('/brands/:brandSlug/models', (req, res) => {
  const models = getModelsByBrand(req.params.brandSlug);

  if (!models) {
    return res.status(404).json({
      error: 'Brand not found.',
    });
  }

  return res.status(200).json({
    brand: getBrandBySlug(req.params.brandSlug)?.name ?? req.params.brandSlug,
    data: models,
  });
});

router.post('/estimate', (req, res) => {
  const payload = {
    brandSlug: req.body.brandSlug,
    brandName: req.body.brandName,
    modelSlug: req.body.modelSlug,
    modelName: req.body.modelName,
    ageInMonths: Number(req.body.ageInMonths),
    originalPrice: Number(req.body.originalPrice),
    condition: req.body.condition,
    conditionData: {
      physical: req.body.conditionData?.physical,
      screen: req.body.conditionData?.screen,
      battery: req.body.conditionData?.battery,
      age: Number(req.body.conditionData?.age),
      usage: req.body.conditionData?.usage,
      accessories: req.body.conditionData?.accessories,
      repairs: req.body.conditionData?.repairs,
      warranty: req.body.conditionData?.warranty,
    },
    storage: req.body.storage,
  };

  const validationMessage = validatePhoneEstimateInput(payload);
  if (validationMessage) {
    return res.status(400).json({
      error: validationMessage,
      supportedConditions: CONDITIONS,
    });
  }

  return res.status(200).json({
    message: 'Phone estimate calculated successfully.',
    data: estimatePhoneResale(payload),
  });
});

module.exports = router;
