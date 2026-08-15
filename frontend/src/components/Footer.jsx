import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-block">
          <div className="footer-brand">
            <span className="brand-mark">SV</span>
            <span>ShopVault</span>
          </div>
          <p>
            A modern microservices ecommerce platform built with Spring Boot, React, Kafka,
            and Elasticsearch.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All products</Link></li>
            <li><Link to="/deals">Deals</Link></li>
            <li><Link to="/">New arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/account?tab=orders">Order tracking</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li><Mail size={16} /> support@shopvault.dev</li>
            <li><Phone size={16} /> +91 98765 43210</li>
            <li><MapPin size={16} /> Bengaluru, India</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 ShopVault. Built for learning & portfolio.</span>
        <a href="https://github.com/manoj13121999/ecommerce-platform" target="_blank" rel="noreferrer">
          <ExternalLink size={16} />
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
