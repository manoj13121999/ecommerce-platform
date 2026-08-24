import { Link } from 'react-router-dom';
import './ShopVaultFooter.css';

export default function ShopVaultFooter() {
  return (
    <footer className="shopvault-footer">
      <div className="shopvault-footer-inner">
        <p className="shopvault-footer-note">
          Prices include GST and standard delivery. Product availability and offers may vary.
        </p>

        <div className="shopvault-footer-columns">
          <div>
            <h4>Shop and Learn</h4>
            <ul>
              <li><Link to="/shop">Shop all</Link></li>
              <li><Link to="/shop?category=1">Electronics</Link></li>
              <li><Link to="/shop?category=9">Fashion</Link></li>
              <li><Link to="/shop?category=21">Home</Link></li>
              <li><Link to="/deals">Deals</Link></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><Link to="/account">Manage your account</Link></li>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/register">Create account</Link></li>
            </ul>
          </div>
          <div>
            <h4>ShopVault</h4>
            <ul>
              <li><Link to="/">Newsroom</Link></li>
              <li><Link to="/shop">Shop online</Link></li>
              <li><Link to="/deals">Special offers</Link></li>
            </ul>
          </div>
          <div>
            <h4>About ShopVault</h4>
            <ul>
              <li><Link to="/shop">Browse catalog</Link></li>
              <li><a href="mailto:support@shopvault.dev">Contact us</a></li>
            </ul>
          </div>
        </div>

        <div className="shopvault-footer-bottom">
          <span>Copyright © 2026 ShopVault Inc. All rights reserved.</span>
          <div className="shopvault-footer-legal">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Use</Link>
            <Link to="/">Sales Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
