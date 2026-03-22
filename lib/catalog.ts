export const conditions = ['excellent', 'good', 'fair', 'poor'] as const;

export type Condition = (typeof conditions)[number];
export type CategorySlug = 'phones' | 'laptops' | 'tablets' | 'accessories';

export type ModelDefinition = {
  slug: string;
  name: string;
  launchPrice: number;
  releaseYear: number;
  segment: 'flagship' | 'premium' | 'midrange' | 'budget';
  modelRetentionBoost: number;
};

export type BrandDefinition = {
  slug: string;
  name: string;
  brandPremium: number;
  monthlyDepreciation: number;
  floorRetention: number;
  models: ModelDefinition[];
};

export type CategoryDefinition = {
  slug: CategorySlug;
  label: string;
  description: string;
  baseRetention: number;
  brands: BrandDefinition[];
};

export const phaseOneCatalog: CategoryDefinition[] = [
  {
    slug: 'phones',
    label: 'Phones',
    description: 'Brand retention matters most here, so choose the exact brand and model.',
    baseRetention: 0.79,
    brands: [
      {
        slug: 'apple',
        name: 'Apple',
        brandPremium: 0.1,
        monthlyDepreciation: 0.018,
        floorRetention: 0.34,
        models: [
          { slug: 'iphone-15', name: 'iPhone 15', launchPrice: 79900, releaseYear: 2023, segment: 'flagship', modelRetentionBoost: 0.05 },
          { slug: 'iphone-14', name: 'iPhone 14', launchPrice: 69900, releaseYear: 2022, segment: 'flagship', modelRetentionBoost: 0.04 },
          { slug: 'iphone-13', name: 'iPhone 13', launchPrice: 59900, releaseYear: 2021, segment: 'flagship', modelRetentionBoost: 0.03 },
        ],
      },
      {
        slug: 'samsung',
        name: 'Samsung',
        brandPremium: 0.05,
        monthlyDepreciation: 0.022,
        floorRetention: 0.28,
        models: [
          { slug: 'galaxy-s24', name: 'Galaxy S24', launchPrice: 74999, releaseYear: 2024, segment: 'flagship', modelRetentionBoost: 0.04 },
          { slug: 'galaxy-s23', name: 'Galaxy S23', launchPrice: 74999, releaseYear: 2023, segment: 'flagship', modelRetentionBoost: 0.035 },
          { slug: 'galaxy-a54', name: 'Galaxy A54', launchPrice: 38999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.015 },
        ],
      },
      {
        slug: 'oneplus',
        name: 'OnePlus',
        brandPremium: 0.04,
        monthlyDepreciation: 0.023,
        floorRetention: 0.25,
        models: [
          { slug: 'oneplus-12', name: 'OnePlus 12', launchPrice: 64999, releaseYear: 2024, segment: 'flagship', modelRetentionBoost: 0.03 },
          { slug: 'oneplus-11', name: 'OnePlus 11', launchPrice: 56999, releaseYear: 2023, segment: 'flagship', modelRetentionBoost: 0.025 },
          { slug: 'nord-3', name: 'Nord 3', launchPrice: 33999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.01 },
        ],
      },
    ],
  },
  {
    slug: 'laptops',
    label: 'Laptops',
    description: 'Laptops depend on brand strength, age, and condition retention.',
    baseRetention: 0.74,
    brands: [
      {
        slug: 'apple',
        name: 'Apple',
        brandPremium: 0.09,
        monthlyDepreciation: 0.015,
        floorRetention: 0.36,
        models: [
          { slug: 'macbook-air-m2', name: 'MacBook Air M2', launchPrice: 99900, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.05 },
          { slug: 'macbook-air-m1', name: 'MacBook Air M1', launchPrice: 79900, releaseYear: 2020, segment: 'premium', modelRetentionBoost: 0.04 },
          { slug: 'macbook-pro-14', name: 'MacBook Pro 14', launchPrice: 169900, releaseYear: 2023, segment: 'flagship', modelRetentionBoost: 0.06 },
        ],
      },
      {
        slug: 'dell',
        name: 'Dell',
        brandPremium: 0.04,
        monthlyDepreciation: 0.018,
        floorRetention: 0.27,
        models: [
          { slug: 'xps-13', name: 'XPS 13', launchPrice: 109999, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.03 },
          { slug: 'inspiron-14', name: 'Inspiron 14', launchPrice: 64999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.015 },
          { slug: 'g15', name: 'Dell G15', launchPrice: 89999, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.02 },
        ],
      },
      {
        slug: 'lenovo',
        name: 'Lenovo',
        brandPremium: 0.03,
        monthlyDepreciation: 0.019,
        floorRetention: 0.26,
        models: [
          { slug: 'thinkpad-e14', name: 'ThinkPad E14', launchPrice: 72999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.02 },
          { slug: 'ideapad-slim-5', name: 'IdeaPad Slim 5', launchPrice: 61999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.015 },
          { slug: 'legion-5', name: 'Legion 5', launchPrice: 99999, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.025 },
        ],
      },
    ],
  },
  {
    slug: 'tablets',
    label: 'Tablets',
    description: 'Tablet resale sits between phones and laptops, with brand and model still important.',
    baseRetention: 0.72,
    brands: [
      {
        slug: 'apple',
        name: 'Apple',
        brandPremium: 0.08,
        monthlyDepreciation: 0.017,
        floorRetention: 0.33,
        models: [
          { slug: 'ipad-10th-gen', name: 'iPad 10th Gen', launchPrice: 44900, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.035 },
          { slug: 'ipad-air-m2', name: 'iPad Air M2', launchPrice: 59900, releaseYear: 2024, segment: 'premium', modelRetentionBoost: 0.04 },
          { slug: 'ipad-mini', name: 'iPad Mini', launchPrice: 49900, releaseYear: 2021, segment: 'premium', modelRetentionBoost: 0.03 },
        ],
      },
      {
        slug: 'samsung',
        name: 'Samsung',
        brandPremium: 0.04,
        monthlyDepreciation: 0.02,
        floorRetention: 0.27,
        models: [
          { slug: 'galaxy-tab-s9', name: 'Galaxy Tab S9', launchPrice: 72999, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.03 },
          { slug: 'galaxy-tab-s9-fe', name: 'Galaxy Tab S9 FE', launchPrice: 36999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.015 },
          { slug: 'galaxy-tab-a9-plus', name: 'Galaxy Tab A9+', launchPrice: 22999, releaseYear: 2023, segment: 'budget', modelRetentionBoost: 0.008 },
        ],
      },
      {
        slug: 'xiaomi',
        name: 'Xiaomi',
        brandPremium: 0.02,
        monthlyDepreciation: 0.022,
        floorRetention: 0.24,
        models: [
          { slug: 'pad-6', name: 'Xiaomi Pad 6', launchPrice: 26999, releaseYear: 2023, segment: 'midrange', modelRetentionBoost: 0.012 },
          { slug: 'pad-5', name: 'Xiaomi Pad 5', launchPrice: 24999, releaseYear: 2022, segment: 'midrange', modelRetentionBoost: 0.01 },
        ],
      },
    ],
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    description: 'Optional support for high-demand accessories and wearables.',
    baseRetention: 0.58,
    brands: [
      {
        slug: 'apple',
        name: 'Apple',
        brandPremium: 0.06,
        monthlyDepreciation: 0.024,
        floorRetention: 0.22,
        models: [
          { slug: 'airpods-pro-2', name: 'AirPods Pro 2', launchPrice: 24900, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.03 },
          { slug: 'apple-watch-se', name: 'Apple Watch SE', launchPrice: 29900, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.025 },
        ],
      },
      {
        slug: 'samsung',
        name: 'Samsung',
        brandPremium: 0.03,
        monthlyDepreciation: 0.026,
        floorRetention: 0.2,
        models: [
          { slug: 'galaxy-buds-2-pro', name: 'Galaxy Buds 2 Pro', launchPrice: 17999, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.02 },
          { slug: 'galaxy-watch-6', name: 'Galaxy Watch 6', launchPrice: 29999, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.022 },
        ],
      },
      {
        slug: 'sony',
        name: 'Sony',
        brandPremium: 0.04,
        monthlyDepreciation: 0.025,
        floorRetention: 0.21,
        models: [
          { slug: 'wh-1000xm5', name: 'WH-1000XM5', launchPrice: 29990, releaseYear: 2022, segment: 'premium', modelRetentionBoost: 0.028 },
          { slug: 'wf-1000xm5', name: 'WF-1000XM5', launchPrice: 24990, releaseYear: 2023, segment: 'premium', modelRetentionBoost: 0.025 },
        ],
      },
      {
        slug: 'other-accessories',
        name: 'Other Accessories',
        brandPremium: 0.01,
        monthlyDepreciation: 0.028,
        floorRetention: 0.18,
        models: [
          { slug: 'earphones', name: 'Earphones', launchPrice: 999, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'headphones', name: 'Headphones', launchPrice: 2999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'earbuds', name: 'Earbuds', launchPrice: 2499, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'chargers', name: 'Chargers', launchPrice: 1499, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'charging-cables', name: 'Charging Cables', launchPrice: 499, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'power-banks', name: 'Power Banks', launchPrice: 1999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.005 },
          { slug: 'phone-cases', name: 'Phone Cases', launchPrice: 699, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'screen-protectors', name: 'Screen Protectors', launchPrice: 399, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'laptop-bags', name: 'Laptop Bags', launchPrice: 1799, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.005 },
          { slug: 'laptop-sleeves', name: 'Laptop Sleeves', launchPrice: 1299, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'keyboards', name: 'Keyboards', launchPrice: 2499, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'mouse', name: 'Mouse', launchPrice: 1299, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0.005 },
          { slug: 'mouse-pads', name: 'Mouse Pads', launchPrice: 499, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'usb-drives', name: 'USB Drives', launchPrice: 899, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'external-hard-drives', name: 'External Hard Drives', launchPrice: 4999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'memory-cards', name: 'Memory Cards', launchPrice: 999, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'usb-hubs', name: 'USB Hubs', launchPrice: 1499, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0.005 },
          { slug: 'adapters', name: 'Adapters', launchPrice: 999, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'docking-stations', name: 'Docking Stations', launchPrice: 6999, releaseYear: 2024, segment: 'premium', modelRetentionBoost: 0.015 },
          { slug: 'cooling-pads', name: 'Cooling Pads', launchPrice: 1999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.005 },
          { slug: 'stylus-pens', name: 'Stylus Pens', launchPrice: 2999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'smartwatch-straps', name: 'Smartwatch Straps', launchPrice: 899, releaseYear: 2024, segment: 'budget', modelRetentionBoost: 0 },
          { slug: 'camera-lenses', name: 'Camera Lenses', launchPrice: 14999, releaseYear: 2024, segment: 'premium', modelRetentionBoost: 0.02 },
          { slug: 'tripods', name: 'Tripods', launchPrice: 2499, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.005 },
          { slug: 'camera-bags', name: 'Camera Bags', launchPrice: 2999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.005 },
          { slug: 'speakers', name: 'Speakers', launchPrice: 3499, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'microphones', name: 'Microphones', launchPrice: 3999, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'game-controllers', name: 'Game Controllers', launchPrice: 4499, releaseYear: 2024, segment: 'midrange', modelRetentionBoost: 0.01 },
          { slug: 'vr-headsets', name: 'VR Headsets', launchPrice: 24999, releaseYear: 2024, segment: 'premium', modelRetentionBoost: 0.02 }
        ],
      },
    ],
  },
];

export function getCategoryDefinition(category: CategorySlug) {
  return phaseOneCatalog.find((entry) => entry.slug === category);
}

export function getBrandDefinition(category: CategorySlug, brandSlug: string) {
  return getCategoryDefinition(category)?.brands.find((brand) => brand.slug === brandSlug);
}

export function getModelDefinition(category: CategorySlug, brandSlug: string, modelSlug: string) {
  return getBrandDefinition(category, brandSlug)?.models.find((model) => model.slug === modelSlug);
}

export function getDefaultBrandSlug(category: CategorySlug) {
  return getCategoryDefinition(category)?.brands[0]?.slug ?? 'apple';
}

export function getDefaultModelSlug(category: CategorySlug, brandSlug: string) {
  return getBrandDefinition(category, brandSlug)?.models[0]?.slug ?? '';
}
