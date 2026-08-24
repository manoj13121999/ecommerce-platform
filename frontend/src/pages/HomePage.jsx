import { useEffect, useState } from 'react';
import { catalogApi } from '../api/client';
import ShopVaultHome from './home/ShopVaultHome';

async function loadFeaturedProducts() {
  const attempts = [
    { page: 0, size: 12, sort: 'newest' },
    { page: 0, size: 12, sort: 'name_asc' },
  ];

  for (const params of attempts) {
    const productsPage = await catalogApi.getProducts(params);
    if (productsPage.content?.length > 0) {
      return productsPage.content;
    }
  }

  const dealsPage = await catalogApi.getDeals({ page: 0, size: 12 });
  return dealsPage.content || [];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => {
    setLoadingFeatured(true);
    setFeaturedError(false);

    Promise.all([
      loadFeaturedProducts(),
      catalogApi.getCategories(),
    ])
      .then(([products, categoryList]) => {
        setFeaturedProducts(products);
        setCategories(categoryList);
      })
      .catch(() => {
        setFeaturedProducts([]);
        setFeaturedError(true);
      })
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <ShopVaultHome
      categories={categories}
      featuredProducts={featuredProducts}
      loadingFeatured={loadingFeatured}
      featuredError={featuredError}
    />
  );
}
