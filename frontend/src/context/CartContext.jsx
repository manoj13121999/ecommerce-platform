import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const emptyCart = { items: [], itemCount: 0, subtotal: 0 };

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return null;
    }

    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart({
        items: data.items || [],
        itemCount: data.itemCount || 0,
        subtotal: Number(data.subtotal) || 0,
      });
      return data;
    } catch {
      setCart(emptyCart);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const data = await cartApi.addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
    setCart({
      items: data.items || [],
      itemCount: data.itemCount || 0,
      subtotal: Number(data.subtotal) || 0,
    });
    return data;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const data = await cartApi.updateItem(productId, { quantity });
    setCart({
      items: data.items || [],
      itemCount: data.itemCount || 0,
      subtotal: Number(data.subtotal) || 0,
    });
    return data;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const data = await cartApi.removeItem(productId);
    setCart({
      items: data.items || [],
      itemCount: data.itemCount || 0,
      subtotal: Number(data.subtotal) || 0,
    });
    return data;
  }, []);

  const clearCart = useCallback(async () => {
    const data = await cartApi.clearCart();
    setCart({
      items: data.items || [],
      itemCount: data.itemCount || 0,
      subtotal: Number(data.subtotal) || 0,
    });
    return data;
  }, []);

  const value = useMemo(
    () => ({
      cart,
      itemCount: cart.itemCount,
      loading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [cart, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart],
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
