import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { orderApi, paymentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { orderStatusClass, orderStatusLabel, orderTrackingSteps } from '../utils/orderStatus';
import './OrderPage.css';

export default function OrderPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const loadOrder = useCallback(async () => {
    const data = await orderApi.getOrder(id);
    setOrder(data);
    return data;
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    let attempts = 0;

    async function fetchWithPoll() {
      setLoading(true);
      setError('');
      try {
        let data = await loadOrder();
        if (cancelled) return;

        while (!cancelled && data.status === 'PLACED' && attempts < 8) {
          await new Promise((resolve) => setTimeout(resolve, 750));
          data = await loadOrder();
          attempts += 1;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Order not found');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWithPoll();
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, loadOrder]);

  async function handlePayNow() {
    if (!order || !user) return;
    setPaying(true);
    setPayError('');
    try {
      await paymentApi.processPayment({
        orderId: order.id,
        amount: order.subtotal,
        paymentMethod: 'CARD',
        customerEmail: user.email,
      });
      const updated = await loadOrder();
      setOrder(updated);
    } catch (err) {
      setPayError(err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  }

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

  const isPaid = order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';
  const trackingSteps = orderTrackingSteps(order.status);
  const statusClass = orderStatusClass(order.status);

  let heroTitle = 'Order received';
  let heroIcon = Package;
  if (order.status === 'PAID') {
    heroTitle = 'Thank you for your order';
    heroIcon = CheckCircle2;
  } else if (order.status === 'SHIPPED') {
    heroTitle = 'Your order is on the way';
    heroIcon = Truck;
  } else if (order.status === 'DELIVERED') {
    heroTitle = 'Order delivered';
    heroIcon = CheckCircle2;
  } else if (isCancelled) {
    heroTitle = 'Order cancelled';
    heroIcon = Package;
  }

  const HeroIcon = heroIcon;

  return (
    <div className="container order-page">
      <div className={`order-success${isPaid ? '' : ' order-success-pending'}${isCancelled ? ' order-success-cancelled' : ''}`}>
        <HeroIcon size={40} />
        <h1>{heroTitle}</h1>
        <p>Order #{order.id} · {orderStatusLabel(order.status)}</p>
      </div>

      <section className="order-tracking">
        <h2>Tracking</h2>
        <ol className="order-tracking-steps">
          {trackingSteps.map((step) => (
            <li
              key={step.key}
              className={`order-tracking-step${step.done ? ' done' : ''}${step.active ? ' active' : ''}${step.cancelled ? ' cancelled' : ''}`}
            >
              <span className="order-tracking-dot" />
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

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
          <p>
            <span>Status</span>
            <strong className={statusClass}>{orderStatusLabel(order.status)}</strong>
          </p>
          <p><span>Total</span> <strong>{formatPrice(order.subtotal)}</strong></p>
          <p className="order-address"><span>Ship to</span> {order.shippingAddress}</p>

          {order.status === 'PLACED' && (
            <>
              <button type="button" className="btn btn-primary" disabled={paying} onClick={handlePayNow}>
                {paying ? 'Processing...' : `Pay ${formatPrice(order.subtotal)}`}
              </button>
              {payError && <p className="order-pay-error">{payError}</p>}
            </>
          )}

          {isPaid && !isCancelled && (
            <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
          )}
          <Link to="/account?tab=orders" className="order-link">View all orders</Link>
        </aside>
      </div>
    </div>
  );
}
