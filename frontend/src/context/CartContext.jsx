import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItemCount(0);
      return;
    }

    setLoading(true);
    try {
      const cart = await cartApi.getCart();
      setItemCount(cart.itemCount || 0);
    } catch {
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const cart = await cartApi.addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
    setItemCount(cart.itemCount || 0);
    return cart;
  }, []);

  const value = useMemo(
    () => ({
      itemCount,
      loading,
      refreshCart,
      addToCart,
    }),
    [itemCount, loading, refreshCart, addToCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
