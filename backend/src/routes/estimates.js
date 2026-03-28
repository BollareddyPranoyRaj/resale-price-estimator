const express = require('express');

const {
  CONDITIONS,
  estimateResale,
  validateEstimateInput,
} = require('../services/estimateEngine');

const router = express.Router();

router.post('/', (req, res) => {
  const payload = {
    category: req.body.category,
    brandName: req.body.brandName,
    modelName: req.body.modelName,
    originalPrice: Number(req.body.originalPrice),
    ageInMonths: Number(req.body.ageInMonths),
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
  };

  const validationMessage = validateEstimateInput(payload);
  if (validationMessage) {
    return res.status(400).json({
      error: validationMessage,
      supportedConditions: CONDITIONS,
    });
  }

  return res.status(200).json({
    message: 'Estimate calculated successfully.',
    data: estimateResale(payload),
  });
});

module.exports = router;
