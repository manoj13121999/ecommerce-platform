import { useEffect, useState } from 'react';
import { catalogApi } from '../api/client';
import ShopVaultHome from './home/ShopVaultHome';

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    catalogApi.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return <ShopVaultHome categories={categories} />;
}
