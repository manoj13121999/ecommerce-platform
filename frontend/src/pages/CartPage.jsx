import { Link, Navigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { catalogApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { productImageFallback } from '../utils/productImages';
import './CartPage.css';

function CartLineItem({ item, warning, onUpdate, onRemove, busy }) {
  const fallback = productImageFallback(null, null);
  const [imageSrc, setImageSrc] = useState(item.imageUrl || fallback);

  return (
    <article className="cart-line">
      <Link to={`/shop/products/${item.productId}`} className="cart-line-image">
        <img
          src={imageSrc}
          alt={item.productName}
          onError={() => setImageSrc(fallback)}
        />
      </Link>
      <div className="cart-line-body">
        <Link to={`/shop/products/${item.productId}`} className="cart-line-title">
          {item.productName}
        </Link>
        <p className="cart-line-price">{formatPrice(item.price)}</p>
        {warning && <p className="cart-line-warning">{warning}</p>}
        <div className="cart-line-actions">
          <div className="qty-control">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={busy || item.quantity <= 1}
              onClick={() => onUpdate(item.productId, item.quantity - 1)}
            >
              <Minus size={14} />
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={busy}
              onClick={() => onUpdate(item.productId, item.quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            type="button"
            className="cart-remove-btn"
            disabled={busy}
            onClick={() => onRemove(item.productId)}
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      </div>
      <p className="cart-line-total">{formatPrice(item.lineTotal)}</p>
    </article>
  );
}

export default function CartPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const [busyId, setBusyId] = useState(null);
  const [liveProducts, setLiveProducts] = useState(null);

  useEffect(() => {
    if (cart.items.length === 0) {
      setLiveProducts({});
      return;
    }
    let cancelled = false;
    catalogApi.getProductsByIds(cart.items.map((item) => item.productId))
      .then((products) => {
        if (cancelled) return;
        const next = {};
        products.forEach((product) => {
          next[product.id] = product;
        });
        setLiveProducts(next);
      })
      .catch(() => {
        if (!cancelled) setLiveProducts(null);
      });
    return () => {
      cancelled = true;
    };
  }, [cart.items]);

  const warnings = useMemo(() => {
    const next = {};
    if (!liveProducts) {
      return next;
    }
    cart.items.forEach((item) => {
      const product = liveProducts[item.productId];
      if (!product) {
        next[item.productId] = 'This product may no longer be available.';
        return;
      }
      if (product.stock === 0) {
        next[item.productId] = 'Out of stock. Remove this item to continue.';
      } else if (item.quantity > product.stock) {
        next[item.productId] = `Only ${product.stock} left. Reduce quantity to check out.`;
      } else if (Number(product.price) !== Number(item.price)) {
        next[item.productId] = `Price is now ${formatPrice(product.price)} and will be applied at checkout.`;
      }
    });
    return next;
  }, [cart.items, liveProducts]);

  const checkoutBlocked = liveProducts != null && cart.items.some((item) => {
    const product = liveProducts[item.productId];
    return !product || product.stock === 0 || item.quantity > product.stock;
  });

  if (authLoading) {
    return <div className="container cart-page"><p className="cart-state">Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/cart' }} />;
  }

  async function handleUpdate(productId, quantity) {
    setBusyId(productId);
    try {
      await updateQuantity(productId, quantity);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(productId) {
    setBusyId(productId);
    try {
      await removeItem(productId);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="container cart-page">
      <div className="cart-header">
        <h1><ShoppingBag size={24} /> Your bag</h1>
        <p>{cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}</p>
      </div>

      {loading && cart.items.length === 0 ? (
        <p className="cart-state">Loading your bag...</p>
      ) : cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is empty.</p>
          <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                warning={warnings[item.productId]}
                busy={busyId === item.productId}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(cart.subtotal)}</strong>
            </div>
            <p className="cart-summary-note">Shipping and taxes calculated at checkout.</p>
            {checkoutBlocked ? (
              <p className="cart-checkout-blocked">Fix stock issues before checkout.</p>
            ) : (
              <Link to="/checkout" className="btn btn-primary btn-lg cart-checkout-btn">
                Check out
              </Link>
            )}
            <Link to="/shop" className="cart-continue-link">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
