import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ShopVaultProductCard from '../../components/shopvault/ShopVaultProductCard';
import {
  pickCategoryById,
  SPOTLIGHT_CATEGORY_IDS,
  spotlightImage,
} from '../../utils/homeCategories';
import './ShopVaultHome.css';

const SPOTLIGHT_CATEGORIES = [
  {
    label: 'Electronics',
    categoryId: SPOTLIGHT_CATEGORY_IDS.electronics,
    blurb: 'Phones, audio, laptops & smart gear',
  },
  {
    label: 'Fashion',
    categoryId: SPOTLIGHT_CATEGORY_IDS.fashion,
    blurb: 'Styles that move with you',
  },
  {
    label: 'Home',
    categoryId: SPOTLIGHT_CATEGORY_IDS.home,
    blurb: 'Furniture, decor & everyday essentials',
  },
];

export default function ShopVaultHome({ categories, featuredProducts, loadingFeatured, featuredError }) {
  const spotlightCategories = SPOTLIGHT_CATEGORIES.map((item) => ({
    ...item,
    category: pickCategoryById(categories, item.categoryId),
  }));

  function CategoryImage({ label }) {
    const [src] = useState(() => spotlightImage(label));
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
      />
    );
  }

  return (
    <div className="shopvault-home">
      <section className="shopvault-hero">
        <p className="shopvault-eyebrow">ShopVault</p>
        <h1>
          Unlock everything
          <br />
          worth buying.
        </h1>
        <p className="shopvault-subtitle">
          Curated electronics, fashion, and home picks — great prices, zero clutter.
        </p>
        <div className="shopvault-hero-links">
          <Link to="/shop" className="shopvault-hero-btn shopvault-hero-btn-primary">
            Start shopping
          </Link>
          <Link to="/deals" className="shopvault-hero-btn shopvault-hero-btn-secondary">
            View deals
          </Link>
        </div>
      </section>

      <section className="shopvault-feature-strip">
        <div className="shopvault-feature-grid">
          {spotlightCategories.map(({ label, categoryId, blurb, category }) => (
            <Link
              key={label}
              to={`/shop?category=${categoryId}`}
              className="shopvault-feature-tile"
            >
              <div className="shopvault-feature-image">
                <CategoryImage label={label} />
              </div>
              <div className="shopvault-feature-copy">
                <h2>{label}</h2>
                <p>{category?.description || blurb}</p>
                <span className="shopvault-feature-cta">
                  Shop {label.toLowerCase()} <ChevronRight size={14} strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shopvault-latest">
        <div className="shopvault-latest-inner">
          <div className="shopvault-latest-header">
            <h2>New arrivals</h2>
            <Link to="/shop?sort=newest" className="shopvault-link">
              See all <ChevronRight size={16} strokeWidth={2} />
            </Link>
          </div>

          <div className="shopvault-product-rail">
            {loadingFeatured && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shopvault-rail-skeleton" />
            ))}

            {!loadingFeatured && featuredProducts.length > 0 && featuredProducts.map((product) => (
              <ShopVaultProductCard key={product.id} product={product} />
            ))}
          </div>

          {!loadingFeatured && featuredProducts.length === 0 && (
            <div className="shopvault-empty-rail">
              <p>{featuredError ? 'Could not load products right now.' : 'No products to show yet.'}</p>
              <Link to="/shop" className="shopvault-link">
                Browse the shop <ChevronRight size={16} strokeWidth={2} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="shopvault-help-strip">
        <div className="shopvault-help-inner">
          <div className="shopvault-help-card">
            <h3>Free delivery over ₹999</h3>
            <p>On eligible orders across India.</p>
          </div>
          <div className="shopvault-help-card">
            <h3>7-day easy returns</h3>
            <Link to="/shop" className="shopvault-link">
              Shop with confidence <ChevronRight size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
