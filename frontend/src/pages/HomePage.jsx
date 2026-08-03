import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { catalogApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './HomePage.css';

const features = [
  {
    title: 'Fast delivery',
    text: 'Express shipping on eligible orders with real-time tracking.',
  },
  {
    title: 'Secure payments',
    text: 'Stripe-powered checkout with encrypted transactions.',
  },
  {
    title: 'Smart search',
    text: 'Elasticsearch-powered product discovery across 5000+ items.',
  },
  {
    title: 'Microservices',
    text: 'Spring Boot, Kafka, Redis, MongoDB, and Elasticsearch.',
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    Promise.all([
      catalogApi.getProducts({ page: 0, size: 8, sort: 'newest' }),
      catalogApi.getCategories(),
    ])
      .then(([productsPage, categoryList]) => {
        setFeaturedProducts(productsPage.content);
        setCategories(categoryList.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  const heroProduct = featuredProducts[0];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">
              <Sparkles size={16} />
              Phase 2 live — Catalog + Elasticsearch
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
            {heroProduct ? (
              <div className="hero-card hero-card-main hero-card-product">
                <img src={heroProduct.imageUrl} alt={heroProduct.name} />
                <div className="hero-card-product-info">
                  <span className="hero-card-label">Featured product</span>
                  <h3>{heroProduct.name}</h3>
                </div>
              </div>
            ) : (
              <div className="hero-card hero-card-main">
                <span className="hero-card-label">Trending now</span>
                <h3>Explore our catalog</h3>
              </div>
            )}
            <div className="hero-card hero-card-secondary">
              <span>Catalog size</span>
              <strong>5000+ products</strong>
            </div>
            <div className="hero-stat">
              <strong>50</strong>
              <span>Categories live</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header section-header-row">
            <div>
              <h2>Featured products</h2>
              <p>Fresh picks from the catalog service — updated in real time.</p>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">View all</Link>
          </div>
          <div className="product-grid home-product-grid">
            {loadingFeatured && Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
            {!loadingFeatured && featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <h2>Shop by category</h2>
            <p>Explore top categories from the live catalog.</p>
          </div>
          <div className="card-grid">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className={`category-card category-theme-${index % 4}`}
              >
                <h3>{category.name}</h3>
                <span>{category.productCount} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why ShopVault?</h2>
            <p>Enterprise-grade ecommerce patterns, built for your portfolio and interviews.</p>
          </div>
          <div className="card-grid">
            {features.map(({ title, text }) => (
              <article key={title} className="feature-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
