import { useEffect, useState } from 'react';
import { catalogApi } from '../api/client';
import ShopVaultHome from './home/ShopVaultHome';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    Promise.all([
      catalogApi.getProducts({ page: 0, size: 16, sort: 'newest' }),
      catalogApi.getCategories(),
    ])
      .then(([productsPage, categoryList]) => {
        setFeaturedProducts(productsPage.content);
        setCategories(categoryList);
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <ShopVaultHome
      categories={categories}
      featuredProducts={featuredProducts}
      loadingFeatured={loadingFeatured}
    />
  );
}
