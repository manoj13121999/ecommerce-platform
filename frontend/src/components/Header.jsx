import { Link, NavLink } from 'react-router-dom';
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">SV</span>
          <span className="brand-text">ShopVault</span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => setMobileOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/deals" onClick={() => setMobileOpen(false)}>
            Deals
          </NavLink>
        </nav>

        <div className="header-search">
          <Search size={18} />
          <input type="search" placeholder="Search products..." aria-label="Search products" />
        </div>

        <div className="header-actions">
          <button type="button" className="icon-btn" aria-label="Wishlist">
            <Heart size={20} />
          </button>

          <button type="button" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            <span className="cart-badge">0</span>
          </button>

          {!loading && isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar">{initials}</div>
              <div className="user-meta">
                <span className="user-name">{user.firstName}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button type="button" className="icon-btn" onClick={logout} aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="icon-btn mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
