import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [productIds, setProductIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setProductIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const wishlist = await authApi.getWishlist();
      setProductIds(new Set(wishlist.items.map((item) => item.productId)));
    } catch {
      setProductIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = useCallback(
    (productId) => productIds.has(Number(productId)),
    [productIds],
  );

  const toggleWishlist = useCallback(async (productId) => {
    const id = Number(productId);
    if (productIds.has(id)) {
      await authApi.removeFromWishlist(id);
      setProductIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      return false;
    }

    await authApi.addToWishlist(id);
    setProductIds((current) => new Set(current).add(id));
    return true;
  }, [productIds]);

  const value = useMemo(
    () => ({
      productIds,
      count: productIds.size,
      loading,
      isWishlisted,
      toggleWishlist,
      refreshWishlist,
    }),
    [productIds, loading, isWishlisted, toggleWishlist, refreshWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
