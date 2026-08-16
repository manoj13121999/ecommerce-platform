import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { orderApi, paymentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import './OrderPage.css';

function statusLabel(status) {
  if (status === 'PAID') return 'Paid';
  if (status === 'PLACED') return 'Payment pending';
  return status;
}

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

  const isPaid = order.status === 'PAID';

  return (
    <div className="container order-page">
      <div className={`order-success${isPaid ? '' : ' order-success-pending'}`}>
        <CheckCircle2 size={40} />
        <h1>{isPaid ? 'Thank you for your order' : 'Order received'}</h1>
        <p>Order #{order.id} · {statusLabel(order.status)}</p>
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
          <p><span>Status</span> <strong className={isPaid ? 'order-status-paid' : 'order-status-pending'}>{statusLabel(order.status)}</strong></p>
          <p><span>Total</span> <strong>{formatPrice(order.subtotal)}</strong></p>
          <p className="order-address"><span>Ship to</span> {order.shippingAddress}</p>

          {!isPaid && (
            <>
              <button type="button" className="btn btn-primary" disabled={paying} onClick={handlePayNow}>
                {paying ? 'Processing...' : `Pay ${formatPrice(order.subtotal)}`}
              </button>
              {payError && <p className="order-pay-error">{payError}</p>}
            </>
          )}

          {isPaid && (
            <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
          )}
          <Link to="/account?tab=orders" className="order-link">View all orders</Link>
        </aside>
      </div>
    </div>
  );
}
