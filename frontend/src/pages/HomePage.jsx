import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const categories = [
  { name: 'Electronics', count: '120+ items', className: 'category-electronics' },
  { name: 'Fashion', count: '340+ items', className: 'category-fashion' },
  { name: 'Home & Living', count: '85+ items', className: 'category-home' },
  { name: 'Sports', count: '64+ items', className: 'category-sports' },
];

const features = [
  {
    icon: Truck,
    title: 'Fast delivery',
    text: 'Express shipping on eligible orders with real-time tracking.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    text: 'Stripe-powered checkout with encrypted transactions.',
  },
  {
    icon: Headphones,
    title: '24/7 support',
    text: 'Dedicated help for orders, returns, and account issues.',
  },
  {
    icon: Zap,
    title: 'Microservices powered',
    text: 'Built on Spring Boot, Kafka, Redis, and Elasticsearch.',
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">
              <Sparkles size={16} />
              Phase 1 live — Auth & storefront ready
            </span>
            <h1>
              Shop smarter with
              <span> ShopVault</span>
            </h1>
            <p>
              Discover curated products, seamless checkout, and a blazing-fast experience
              powered by modern microservices architecture.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Browse shop
                <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Create account
                </Link>
              )}
            </div>
            {isAuthenticated && (
              <p className="hero-welcome">
                Welcome back, <strong>{user.firstName}</strong> — ready to explore?
              </p>
            )}
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-card-main">
              <span className="hero-card-label">Trending now</span>
              <h3>Premium wireless headphones</h3>
              <p className="hero-price">₹4,999</p>
              <div className="hero-card-shine" />
            </div>
            <div className="hero-card hero-card-secondary">
              <span>Free shipping</span>
              <strong>On orders ₹999+</strong>
            </div>
            <div className="hero-stat">
              <strong>1000+</strong>
              <span>Happy users seeded</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by category</h2>
            <p>Catalog integration coming in Phase 2 — preview the storefront layout now.</p>
          </div>
          <div className="card-grid">
            {categories.map((category) => (
              <Link key={category.name} to="/shop" className={`category-card ${category.className}`}>
                <h3>{category.name}</h3>
                <span>{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <h2>Why ShopVault?</h2>
            <p>Enterprise-grade ecommerce patterns, built for your portfolio and interviews.</p>
          </div>
          <div className="card-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="feature-card">
                <div className="feature-card-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to build the full flow?</h2>
            <p>Catalog, cart, checkout, and payments are next on the roadmap.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}
