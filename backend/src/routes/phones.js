const express = require('express');

const { CONDITIONS, validatePhoneEstimateInput } = require('../services/phoneEstimateValidation');
const {
  getPhoneBrands,
  getPhoneModels,
  postPhoneEstimate,
} = require('../services/phoneApiService');

const router = express.Router();

router.get('/brands', async (_req, res, next) => {
  try {
    return res.status(200).json({
      data: await getPhoneBrands(),
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/brands/:brandSlug/models', async (req, res, next) => {
  try {
    return res.status(200).json({
      data: await getPhoneModels(req.params.brandSlug),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/estimate', async (req, res, next) => {
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

  try {
    return res.status(200).json({
      message: 'Phone estimate calculated successfully.',
      data: await postPhoneEstimate(payload),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
