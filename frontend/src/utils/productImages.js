// Verified Unsplash images (tested HTTP 200). Used when product seed URLs fail.
const IMG = (id, width = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=80`;

export const DEFAULT_PRODUCT_IMAGE = IMG('1560472354-b33ff0c44a43');

const CATEGORY_IMAGES = [
  { match: /electronic|mobile|laptop|audio|camera|smart|wearable|gaming|phone|computer/i, url: IMG('1517336714731-489689fd1ca8') },
  { match: /fashion|clothing|footwear|bag|watch|jewell|eyewear|men|women|kid/i, url: IMG('1521572163474-6864f9cf17ab') },
  { match: /home|furniture|kitchen|decor|bedding|lighting|storage|garden|living/i, url: IMG('1586023492125-27b2c045efd7') },
  { match: /beauty|makeup|fragrance|personal care/i, url: IMG('1556228720-195a672e8a03') },
  { match: /sport|fitness|cricket|football|cycling|camping|exercise/i, url: IMG('1517836357463-d25dfeac3438') },
  { match: /book|stationery|office/i, url: IMG('1544947950-fa07a98d237f') },
  { match: /toy|baby|board game|educational/i, url: IMG('1545249390-6bdfa286032f') },
  { match: /automotive|car|bike/i, url: IMG('1492144534655-ae79c964c9d7') },
  { match: /grocer|snack|gourmet|beverage/i, url: IMG('1542838132-92c53300491e') },
  { match: /health|wellness|vitamin|medical/i, url: IMG('1571019614242-c5c5dee9f50b') },
  { match: /pet/i, url: IMG('1450778869180-41d0601e046e') },
  { match: /tool|industrial|hardware/i, url: IMG('1581094794329-c8112a89af12') },
];

export function productImageFallback(categoryName, categoryId) {
  const label = `${categoryName || ''} ${categoryId || ''}`;
  const hit = CATEGORY_IMAGES.find(({ match }) => match.test(label));
  return hit?.url || DEFAULT_PRODUCT_IMAGE;
}

export function resolveProductImage(product) {
  return product?.imageUrl || productImageFallback(product?.categoryName, product?.categoryId);
}
