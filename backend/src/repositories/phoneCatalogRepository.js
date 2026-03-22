const phoneCatalog = require('../db/phone-catalog.json');

function getBrands() {
  return phoneCatalog.brands.map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    modelCount: brand.models.length,
  }));
}

function getBrandBySlug(brandSlug) {
  return phoneCatalog.brands.find((brand) => brand.slug === brandSlug);
}

function getBrandByName(brandName) {
  return phoneCatalog.brands.find(
    (brand) => brand.name.toLowerCase() === String(brandName).trim().toLowerCase()
  );
}

function getModelsByBrand(identifier) {
  const brand = getBrandBySlug(identifier) ?? getBrandByName(identifier);
  if (!brand) {
    return null;
  }

  return brand.models.map((model) => ({
    slug: model.slug,
    name: model.name,
    launchPrice: model.launchPrice,
    releaseYear: model.releaseYear,
    segment: model.segment,
  }));
}

function getPhoneModel(brandIdentifier, modelIdentifier) {
  const brand = getBrandBySlug(brandIdentifier) ?? getBrandByName(brandIdentifier);
  if (!brand || !modelIdentifier) {
    return null;
  }

  const normalizedModel = String(modelIdentifier).trim().toLowerCase();
  const model = brand.models.find(
    (entry) =>
      entry.slug === modelIdentifier || entry.name.toLowerCase() === normalizedModel
  );

  if (!model) {
    return null;
  }

  return {
    brand,
    model,
  };
}

module.exports = {
  getBrands,
  getBrandBySlug,
  getBrandByName,
  getModelsByBrand,
  getPhoneModel,
};
