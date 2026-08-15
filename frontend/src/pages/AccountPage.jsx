import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Heart, Lock, Package, UserRound } from 'lucide-react';
import { authApi, catalogApi, orderApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './AccountPage.css';

export default function AccountPage() {
  const { user, isAuthenticated, loading, updateProfile } = useAuth();
  const { productIds, refreshWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab !== 'wishlist' || productIds.size === 0) {
      setWishlistProducts([]);
      return;
    }

    setWishlistLoading(true);
    catalogApi
      .getProductsByIds([...productIds])
      .then(setWishlistProducts)
      .catch(() => setWishlistProducts([]))
      .finally(() => setWishlistLoading(false));
  }, [activeTab, productIds]);

  useEffect(() => {
    if (activeTab !== 'orders') {
      setOrders([]);
      return;
    }

    setOrdersLoading(true);
    orderApi.listOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [activeTab]);

  if (loading) {
    return <div className="container account-state">Loading account...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setSubmittingProfile(true);

    try {
      await updateProfile({ firstName, lastName, phone: phone || null });
      setProfileMessage('Profile updated successfully');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSubmittingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    setSubmittingPassword(true);

    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      setPasswordMessage(response.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSubmittingPassword(false);
    }
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div>
            <h1>My account</h1>
            <p>{user.email}</p>
          </div>
          <span className="account-role">{user.role}</span>
        </div>

        <div className="account-layout">
          <aside className="account-tabs">
            <button
              type="button"
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              <UserRound size={18} />
              Profile
            </button>
            <button
              type="button"
              className={activeTab === 'password' ? 'active' : ''}
              onClick={() => setActiveTab('password')}
            >
              <Lock size={18} />
              Password
            </button>
            <button
              type="button"
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} />
              Orders
            </button>
            <button
              type="button"
              className={activeTab === 'wishlist' ? 'active' : ''}
              onClick={() => {
                setActiveTab('wishlist');
                refreshWishlist();
              }}
            >
              <Heart size={18} />
              Wishlist ({productIds.size})
            </button>
          </aside>

          <div className="account-panel">
            {activeTab === 'profile' && (
              <div className="form-card account-card">
                <h2>Profile details</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        className="form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last name</label>
                      <input
                        id="lastName"
                        className="form-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingProfile}>
                    {submittingProfile ? 'Saving...' : 'Save profile'}
                  </button>
                </form>
                {profileMessage && <div className="form-success">{profileMessage}</div>}
                {profileError && <div className="form-error">{profileError}</div>}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="form-card account-card">
                <h2>Change password</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current password</label>
                    <input
                      id="currentPassword"
                      className="form-input"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New password</label>
                    <input
                      id="newPassword"
                      className="form-input"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingPassword}>
                    {submittingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </form>
                {passwordMessage && <div className="form-success">{passwordMessage}</div>}
                {passwordError && <div className="form-error">{passwordError}</div>}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="account-card">
                <h2>Order history</h2>
                {ordersLoading && <p className="account-empty">Loading orders...</p>}
                {!ordersLoading && orders.length === 0 && (
                  <p className="account-empty">
                    No orders yet. <Link to="/shop">Start shopping</Link>
                  </p>
                )}
                {!ordersLoading && orders.length > 0 && (
                  <ul className="account-orders">
                    {orders.map((order) => (
                      <li key={order.id}>
                        <div>
                          <Link to={`/orders/${order.id}`}>Order #{order.id}</Link>
                          <span>{order.status} · {order.itemCount} items</span>
                        </div>
                        <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.subtotal)}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="account-card">
                <h2>Saved items</h2>
                {productIds.size === 0 && (
                  <p className="account-empty">
                    Your wishlist is empty. <Link to="/shop">Browse the shop</Link>
                  </p>
                )}
                {wishlistLoading && (
                  <div className="product-grid account-product-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                  </div>
                )}
                {!wishlistLoading && wishlistProducts.length > 0 && (
                  <div className="product-grid account-product-grid">
                    {wishlistProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
