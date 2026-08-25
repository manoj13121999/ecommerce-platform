import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ADMIN_PORTAL_URL, isAdminUser } from '../utils/adminPortal';
import './Header.css';

const STORE_NAV = [
  { label: 'Electronics', to: '/shop?category=1' },
  { label: 'Fashion', to: '/shop?category=9' },
  { label: 'Home', to: '/shop?category=21' },
  { label: 'Deals', to: '/deals' },
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = pathname === '/';

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  const isAdmin = isAdminUser(user);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/shop?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  }

  return (
    <header className={`site-header${isHome ? ' header-shopvault' : ''}`}>
      <div className={`header-inner${isHome ? ' header-inner-shopvault' : ' container'}`}>
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          {!isHome && <span className="brand-mark">SV</span>}
          <span className="brand-text">ShopVault</span>
        </Link>

        {isHome ? (
          <nav className={`header-nav header-nav-shopvault ${mobileOpen ? 'open' : ''}`}>
            {STORE_NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {mobileOpen && !loading && !isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
              </>
            )}
            {mobileOpen && !loading && isAuthenticated && (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)}>Account</Link>
                {isAdmin && (
                  <a href={ADMIN_PORTAL_URL} onClick={() => setMobileOpen(false)}>Admin console</a>
                )}
              </>
            )}
          </nav>
        ) : (
          <nav className={`header-nav ${mobileOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" onClick={() => setMobileOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/deals" className="nav-deals" onClick={() => setMobileOpen(false)}>
              Deals
            </NavLink>
          </nav>
        )}

        {!isHome && (
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <Search size={17} />
            <input
              type="search"
              placeholder="Search for products, brands..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="header-search-btn">Search</button>
          </form>
        )}

        <div className={`header-actions${isHome ? ' header-actions-shopvault' : ''}`}>
          {!isHome && isAuthenticated && (
            <Link to="/account?tab=wishlist" className="icon-btn wishlist-link" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
          )}

          {isHome && (
            <Link to="/shop" className="icon-btn shopvault-icon-btn" aria-label="Search">
              <Search size={18} strokeWidth={1.75} />
            </Link>
          )}

          <Link to="/cart" className={`icon-btn cart-btn${isHome ? ' shopvault-icon-btn' : ''}`} aria-label="Bag">
            <ShoppingBag size={18} strokeWidth={isHome ? 1.75 : 2} />
            {itemCount > 0 && <span className={`cart-badge${isHome ? ' shopvault-cart-badge' : ''}`}>{itemCount}</span>}
          </Link>

          {isHome && !loading && isAuthenticated && (
            <>
              {isAdmin && (
                <a href={ADMIN_PORTAL_URL} className="shopvault-auth-link shopvault-admin-link">
                  Admin
                </a>
              )}
              <Link to="/account" className="shopvault-auth-link" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
            </>
          )}

          {isHome && !loading && !isAuthenticated && (
            <div className="shopvault-auth-links">
              <Link to="/login" className="shopvault-auth-link" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="shopvault-auth-link shopvault-auth-link-primary" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </div>
          )}

          {!isHome && !loading && isAuthenticated ? (
            <>
              {isAdmin && (
                <a href={ADMIN_PORTAL_URL} className="btn btn-ghost btn-sm admin-console-link">
                  Admin console
                </a>
              )}
              <Link to="/account" className="user-menu" onClick={() => setMobileOpen(false)}>
              <div className="user-avatar">{initials}</div>
              <div className="user-meta">
                <span className="user-name">{user.firstName}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </Link>
            </>
          ) : (
            !isHome && !loading && (
              <div className="auth-links">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </div>
            )
          )}

          {!isHome && isAuthenticated && (
            <button type="button" className="icon-btn" onClick={logout} aria-label="Logout">
              <LogOut size={18} />
            </button>
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
