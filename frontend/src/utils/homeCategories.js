// Curated category hero images (verified Unsplash IDs from catalog seed)
const IMG = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=80`;

export const CATEGORY_HERO_IMAGES = {
  electronics: IMG('1505740420928-5e560c06d30e'),
  fashion: IMG('1542272604-787c3835535d'),
  home: IMG('1631049307264-da0ec9d70304'),
};

export const SPOTLIGHT_CATEGORY_IDS = {
  electronics: 1,
  fashion: 9,
  home: 21,
};

export function pickCategory(categories, ...names) {
  for (const name of names) {
    const match = categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
    if (match) return match;
  }
  return null;
}

export function pickCategoryById(categories, id) {
  return categories.find((category) => category.id === id) || null;
}

export function spotlightImage(label) {
  const key = label.toLowerCase();
  if (key === 'fashion') return CATEGORY_HERO_IMAGES.fashion;
  if (key === 'home') return CATEGORY_HERO_IMAGES.home;
  return CATEGORY_HERO_IMAGES.electronics;
}

export function categoryImage(category) {
  if (!category) return CATEGORY_HERO_IMAGES.electronics;
  const slug = category.slug || '';
  const name = category.name || '';
  const label = `${slug} ${name}`.toLowerCase();
  if (label.includes('fashion') || label.includes('clothing') || label.includes('footwear')) {
    return CATEGORY_HERO_IMAGES.fashion;
  }
  if (label.includes('home') || label.includes('living') || label.includes('furniture') || label.includes('decor')) {
    return CATEGORY_HERO_IMAGES.home;
  }
  return CATEGORY_HERO_IMAGES.electronics;
}
