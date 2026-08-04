import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ShopVaultProductCard from '../../components/shopvault/ShopVaultProductCard';
import { categoryImage, CATEGORY_HERO_IMAGES, pickCategory } from '../../utils/homeCategories';
import { DEFAULT_PRODUCT_IMAGE } from '../../utils/productImages';
import './ShopVaultHome.css';

const SPOTLIGHT_CATEGORIES = [
  { label: 'Fashion', names: ['Fashion', "Men's Clothing"] },
  { label: 'Home', names: ['Home & Living', 'Home Decor'] },
  { label: 'Electronics', names: ['Electronics'] },
];

export default function ShopVaultHome({ categories, featuredProducts, loadingFeatured }) {
  const spotlightCategories = SPOTLIGHT_CATEGORIES.map((item) => ({
    ...item,
    category: pickCategory(categories, ...item.names),
  }));

  function CategoryImage({ category, label }) {
    const [src, setSrc] = useState(
      category ? categoryImage(category) : CATEGORY_HERO_IMAGES.electronics,
    );
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
        onError={() => setSrc(DEFAULT_PRODUCT_IMAGE)}
      />
    );
  }

  return (
    <div className="shopvault-home">
      <section className="shopvault-hero">
        <p className="shopvault-eyebrow">ShopVault</p>
        <h1>
          Everything you need.
          <br />
          Beautifully simple.
        </h1>
        <p className="shopvault-subtitle">
          Quality products across electronics, fashion, and home — with prices you will actually like.
        </p>
        <div className="shopvault-hero-links">
          <Link to="/shop" className="shopvault-link">
            Shop now <ChevronRight size={17} strokeWidth={2} />
          </Link>
          <Link to="/deals" className="shopvault-link">
            Learn more <ChevronRight size={17} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <section className="shopvault-feature-strip">
        <div className="shopvault-feature-grid">
          {spotlightCategories.map(({ label, category }) => (
            <Link
              key={label}
              to={category ? `/shop?category=${category.id}` : '/shop'}
              className="shopvault-feature-tile"
            >
              <div className="shopvault-feature-image">
                <CategoryImage label={label} category={category} />
              </div>
              <div className="shopvault-feature-copy">
                <h2>{label}</h2>
                <p>
                  {category
                    ? category.description
                    : 'New arrivals every week.'}
                </p>
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
          <h2>The latest. Take a look at what&apos;s new right here.</h2>
          <div className="shopvault-product-rail">
            {loadingFeatured && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shopvault-rail-skeleton" />
            ))}
            {!loadingFeatured && featuredProducts.map((product) => (
              <ShopVaultProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="shopvault-help-strip">
        <div className="shopvault-help-inner">
          <div className="shopvault-help-card">
            <h3>Need shopping help?</h3>
            <Link to="/shop" className="shopvault-link">
              Ask a Specialist <ChevronRight size={15} strokeWidth={2} />
            </Link>
          </div>
          <div className="shopvault-help-card">
            <h3>Visit our store</h3>
            <Link to="/shop" className="shopvault-link">
              Find a store near you <ChevronRight size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
