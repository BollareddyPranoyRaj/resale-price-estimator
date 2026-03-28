export const conditions = ['excellent', 'good', 'fair', 'poor'] as const;

export type Condition = (typeof conditions)[number];
export type CategorySlug = 'phones' | 'laptops' | 'tablets' | 'accessories';

export type BrandDefinition = {
  slug: string;
  name: string;
  brandPremium: number;
  monthlyDepreciation: number;
  floorRetention: number;
};

export type CategoryDefinition = {
  slug: CategorySlug;
  label: string;
  description: string;
  baseRetention: number;
  brands: BrandDefinition[];
};

export const popularModelSuggestions: Record<string, string[]> = {
  apple: ['iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13'],
  samsung: ['Galaxy S24', 'Galaxy S23', 'Galaxy A55', 'Galaxy A54'],
  xiaomi: ['Xiaomi 14', 'Xiaomi 13 Pro', 'Xiaomi 13'],
  redmi: ['Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi 13 5G'],
  poco: ['Poco X6 Pro', 'Poco X6', 'Poco F6'],
  realme: ['Realme GT 6', 'Realme 12 Pro+', 'Realme Narzo 70'],
  oppo: ['Oppo Reno 12', 'Oppo Reno 11', 'Oppo F27 Pro+'],
  vivo: ['Vivo V30', 'Vivo V29', 'Vivo T3'],
  oneplus: ['OnePlus 12', 'OnePlus 12R', 'Nord CE 4'],
  'google-pixel': ['Pixel 9', 'Pixel 8', 'Pixel 8a', 'Pixel 7'],
  motorola: ['Edge 50 Pro', 'Moto G85', 'Moto G64'],
  nothing: ['Phone (2)', 'Phone (2a)', 'Phone (3a)'],
};

export const phaseOneCatalog: CategoryDefinition[] = [
  {
    slug: 'phones',
    label: 'Phones',
    description: 'Search a brand, type the model manually, and estimate resale value fast.',
    baseRetention: 0.79,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.1, monthlyDepreciation: 0.018, floorRetention: 0.34 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.05, monthlyDepreciation: 0.022, floorRetention: 0.28 },
      { slug: 'xiaomi', name: 'Xiaomi', brandPremium: 0.02, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'redmi', name: 'Redmi', brandPremium: 0.015, monthlyDepreciation: 0.027, floorRetention: 0.22 },
      { slug: 'poco', name: 'Poco', brandPremium: 0.015, monthlyDepreciation: 0.027, floorRetention: 0.21 },
      { slug: 'realme', name: 'Realme', brandPremium: 0.012, monthlyDepreciation: 0.028, floorRetention: 0.2 },
      { slug: 'oppo', name: 'Oppo', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'vivo', name: 'Vivo', brandPremium: 0.017, monthlyDepreciation: 0.026, floorRetention: 0.22 },
      { slug: 'oneplus', name: 'OnePlus', brandPremium: 0.04, monthlyDepreciation: 0.023, floorRetention: 0.25 },
      { slug: 'iqoo', name: 'iQOO', brandPremium: 0.018, monthlyDepreciation: 0.025, floorRetention: 0.22 },
      { slug: 'google-pixel', name: 'Google (Pixel)', brandPremium: 0.05, monthlyDepreciation: 0.021, floorRetention: 0.27 },
      { slug: 'motorola', name: 'Motorola', brandPremium: 0.016, monthlyDepreciation: 0.027, floorRetention: 0.21 },
      { slug: 'nokia', name: 'Nokia', brandPremium: 0.01, monthlyDepreciation: 0.029, floorRetention: 0.19 },
      { slug: 'nothing', name: 'Nothing', brandPremium: 0.03, monthlyDepreciation: 0.024, floorRetention: 0.24 },
      { slug: 'infinix', name: 'Infinix', brandPremium: 0.008, monthlyDepreciation: 0.03, floorRetention: 0.18 },
      { slug: 'tecno', name: 'Tecno', brandPremium: 0.008, monthlyDepreciation: 0.03, floorRetention: 0.18 },
      { slug: 'lava', name: 'Lava', brandPremium: 0.006, monthlyDepreciation: 0.031, floorRetention: 0.17 },
      { slug: 'micromax', name: 'Micromax', brandPremium: 0.006, monthlyDepreciation: 0.031, floorRetention: 0.17 },
      { slug: 'karbonn', name: 'Karbonn', brandPremium: 0.005, monthlyDepreciation: 0.032, floorRetention: 0.16 },
      { slug: 'jio', name: 'Jio', brandPremium: 0.005, monthlyDepreciation: 0.032, floorRetention: 0.16 },
      { slug: 'huawei', name: 'Huawei', brandPremium: 0.025, monthlyDepreciation: 0.024, floorRetention: 0.22 },
      { slug: 'honor', name: 'Honor', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.21 },
      { slug: 'sony', name: 'Sony', brandPremium: 0.02, monthlyDepreciation: 0.025, floorRetention: 0.22 },
      { slug: 'asus', name: 'Asus', brandPremium: 0.018, monthlyDepreciation: 0.026, floorRetention: 0.21 },
      { slug: 'zte', name: 'ZTE', brandPremium: 0.01, monthlyDepreciation: 0.029, floorRetention: 0.19 },
    ],
  },
  {
    slug: 'laptops',
    label: 'Laptops',
    description: 'Estimate laptop resale from brand, your price, age, and condition.',
    baseRetention: 0.74,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.09, monthlyDepreciation: 0.015, floorRetention: 0.36 },
      { slug: 'dell', name: 'Dell', brandPremium: 0.04, monthlyDepreciation: 0.018, floorRetention: 0.27 },
      { slug: 'lenovo', name: 'Lenovo', brandPremium: 0.03, monthlyDepreciation: 0.019, floorRetention: 0.26 },
      { slug: 'hp', name: 'HP', brandPremium: 0.03, monthlyDepreciation: 0.019, floorRetention: 0.26 },
      { slug: 'asus', name: 'Asus', brandPremium: 0.028, monthlyDepreciation: 0.02, floorRetention: 0.25 },
      { slug: 'acer', name: 'Acer', brandPremium: 0.022, monthlyDepreciation: 0.021, floorRetention: 0.24 },
    ],
  },
  {
    slug: 'tablets',
    label: 'Tablets',
    description: 'Tablet resale sits between phones and laptops, with brand still affecting retention.',
    baseRetention: 0.72,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.08, monthlyDepreciation: 0.017, floorRetention: 0.33 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.04, monthlyDepreciation: 0.02, floorRetention: 0.27 },
      { slug: 'xiaomi', name: 'Xiaomi', brandPremium: 0.02, monthlyDepreciation: 0.022, floorRetention: 0.24 },
      { slug: 'lenovo', name: 'Lenovo', brandPremium: 0.02, monthlyDepreciation: 0.022, floorRetention: 0.24 },
    ],
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    description: 'Use this for wearables and high-demand accessories with simpler depreciation.',
    baseRetention: 0.58,
    brands: [
      { slug: 'apple', name: 'Apple', brandPremium: 0.06, monthlyDepreciation: 0.024, floorRetention: 0.22 },
      { slug: 'samsung', name: 'Samsung', brandPremium: 0.03, monthlyDepreciation: 0.026, floorRetention: 0.2 },
      { slug: 'sony', name: 'Sony', brandPremium: 0.04, monthlyDepreciation: 0.025, floorRetention: 0.21 },
      { slug: 'boat', name: 'boAt', brandPremium: 0.015, monthlyDepreciation: 0.028, floorRetention: 0.19 },
      { slug: 'other-accessories', name: 'Other Accessories', brandPremium: 0.01, monthlyDepreciation: 0.028, floorRetention: 0.18 },
    ],
  },
];

export function getCategoryDefinition(category: CategorySlug) {
  return phaseOneCatalog.find((entry) => entry.slug === category);
}

export function getBrandDefinition(category: CategorySlug, brandSlug: string) {
  return getCategoryDefinition(category)?.brands.find((brand) => brand.slug === brandSlug);
}

export function getDefaultBrandSlug(category: CategorySlug) {
  return getCategoryDefinition(category)?.brands[0]?.slug ?? 'apple';
}

export function getPopularModelSuggestions(brandSlug?: string, query?: string) {
  if (!brandSlug) {
    return [];
  }

  const suggestions = popularModelSuggestions[brandSlug] ?? [];
  const normalizedQuery = query?.trim().toLowerCase() ?? '';

  if (!normalizedQuery) {
    return [];
  }

  return suggestions.filter((model) => model.toLowerCase().includes(normalizedQuery));
}

export function getPopularModelQuickPicks(brandSlug?: string, limit = 3) {
  if (!brandSlug) {
    return [];
  }

  return (popularModelSuggestions[brandSlug] ?? []).slice(0, limit);
}
