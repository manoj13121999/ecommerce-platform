// Verified Unsplash images (tested HTTP 200). Used when product seed URLs fail.
const IMG = (id, width = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=80`;

export const DEFAULT_PRODUCT_IMAGE = IMG('1560472354-b33ff0c44a43');

const FALLBACK_POOL = [
  IMG('1517336714731-489689fd1ca8'),
  IMG('1521572163474-6864f9cf17ab'),
  IMG('1586023492125-27b2c045efd7'),
  IMG('1556228720-195a672e8a03'),
  IMG('1517836357463-d25dfeac3438'),
  IMG('1544947950-fa07a98d237f'),
  IMG('1545249390-6bdfa286032f'),
  IMG('1492144534655-ae79c964c9d7'),
  IMG('1542838132-92c53300491e'),
  IMG('1571019614242-c5c5dee9f50b'),
  IMG('1450778869180-41d0601e046e'),
  IMG('1581094794329-c8112a89af12'),
];

const CATEGORY_IMAGES = [
  { match: /electronic|mobile|laptop|audio|camera|smart|wearable|gaming|phone|computer/i, url: FALLBACK_POOL[0] },
  { match: /fashion|clothing|footwear|bag|watch|jewell|eyewear|men|women|kid/i, url: FALLBACK_POOL[1] },
  { match: /home|furniture|kitchen|decor|bedding|lighting|storage|garden|living/i, url: FALLBACK_POOL[2] },
  { match: /beauty|makeup|fragrance|personal care/i, url: FALLBACK_POOL[3] },
  { match: /sport|fitness|cricket|football|cycling|camping|exercise/i, url: FALLBACK_POOL[4] },
  { match: /book|stationery|office/i, url: FALLBACK_POOL[5] },
  { match: /toy|baby|board game|educational/i, url: FALLBACK_POOL[6] },
  { match: /automotive|car|bike/i, url: FALLBACK_POOL[7] },
  { match: /grocer|snack|gourmet|beverage/i, url: FALLBACK_POOL[8] },
  { match: /health|wellness|vitamin|medical/i, url: FALLBACK_POOL[9] },
  { match: /pet/i, url: FALLBACK_POOL[10] },
  { match: /tool|industrial|hardware/i, url: FALLBACK_POOL[11] },
];

export function productImageFallback(categoryName, categoryId, productId = 0) {
  const label = `${categoryName || ''} ${categoryId || ''}`;
  const hit = CATEGORY_IMAGES.find(({ match }) => match.test(label));
  const base = hit?.url || DEFAULT_PRODUCT_IMAGE;

  if (!productId) {
    return base;
  }

  const poolIndex = (Number(productId) + Number(categoryId || 0)) % FALLBACK_POOL.length;
  return FALLBACK_POOL[poolIndex] || base;
}

export function resolveProductImage(product) {
  return product?.imageUrl || productImageFallback(
    product?.categoryName,
    product?.categoryId,
    product?.id,
  );
}
