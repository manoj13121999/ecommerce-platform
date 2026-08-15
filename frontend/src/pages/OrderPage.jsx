import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { orderApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import './OrderPage.css';

export default function OrderPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    orderApi.getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message || 'Order not found'))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (authLoading) {
    return <div className="container order-page"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="container order-page"><p>Loading order...</p></div>;
  }

  if (error || !order) {
    return (
      <div className="container order-page order-state">
        <p>{error || 'Order not found'}</p>
        <Link to="/account?tab=orders" className="btn btn-primary">View orders</Link>
      </div>
    );
  }

  return (
    <div className="container order-page">
      <div className="order-success">
        <CheckCircle2 size={40} />
        <h1>Thank you for your order</h1>
        <p>Order #{order.id} · {order.status}</p>
      </div>

      <div className="order-layout">
        <section className="order-panel">
          <h2>Items</h2>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.productId}>
                <div>
                  <Link to={`/shop/products/${item.productId}`}>{item.productName}</Link>
                  <span>Qty {item.quantity}</span>
                </div>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </li>
            ))}
          </ul>
        </section>

        <aside className="order-panel order-summary-panel">
          <h2>Summary</h2>
          <p><span>Status</span> <strong>{order.status}</strong></p>
          <p><span>Total</span> <strong>{formatPrice(order.subtotal)}</strong></p>
          <p className="order-address"><span>Ship to</span> {order.shippingAddress}</p>
          <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
          <Link to="/account?tab=orders" className="order-link">View all orders</Link>
        </aside>
      </div>
    </div>
  );
}
