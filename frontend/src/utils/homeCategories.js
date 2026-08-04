// Curated category hero images (verified Unsplash URLs)
const IMG = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=80`;

export const CATEGORY_HERO_IMAGES = {
  electronics: IMG('1517336714731-489689fd1ca8'),
  fashion: IMG('1521572163474-6864f9cf17ab'),
  home: IMG('1586023492125-27b2c045efd7'),
};

export function pickCategory(categories, ...names) {
  for (const name of names) {
    const match = categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
    if (match) return match;
  }
  return categories[0] || null;
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
