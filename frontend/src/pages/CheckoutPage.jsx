import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { orderApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return <div className="container checkout-page"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/checkout' }} />;
  }

  if (cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const order = await orderApi.placeOrder({
        shippingAddress: address.trim(),
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
        })),
      });
      await clearCart();
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <p className="checkout-intro">Review your order and enter a delivery address.</p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2>Delivery</h2>
            <p className="checkout-account">
              Ordering as <strong>{user.firstName} {user.lastName}</strong> · {user.email}
            </p>
            <label htmlFor="address">Shipping address</label>
            <textarea
              id="address"
              rows={4}
              required
              placeholder="Street, city, state, PIN code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </section>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? 'Placing order...' : `Place order · ${formatPrice(cart.subtotal)}`}
          </button>
          <Link to="/cart" className="checkout-back">Back to bag</Link>
        </form>

        <aside className="checkout-summary">
          <h2>Your bag</h2>
          <ul className="checkout-items">
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>{item.productName} × {item.quantity}</span>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatPrice(cart.subtotal)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
