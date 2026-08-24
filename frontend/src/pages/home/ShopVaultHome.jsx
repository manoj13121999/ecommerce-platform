import { Link } from 'react-router-dom';
import {
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
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

const PERKS = [
  {
    icon: Truck,
    title: 'Free delivery',
    text: 'On orders over ₹999 across India.',
  },
  {
    icon: RotateCcw,
    title: 'Easy returns',
    text: '7-day hassle-free returns on eligible items.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    text: 'Encrypted payments and protected order data.',
  },
  {
    icon: Sparkles,
    title: 'Member perks',
    text: 'Wishlists, order history, and exclusive deals.',
  },
];

const DEALS_IMAGE =
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&auto=format&fit=crop&q=80';

export default function ShopVaultHome({ categories }) {
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

      <section className="shopvault-deals-spotlight">
        <div className="shopvault-deals-inner">
          <div className="shopvault-deals-copy">
            <p className="shopvault-deals-eyebrow">Limited time</p>
            <h2>Today&apos;s best deals</h2>
            <p>Hand-picked markdowns across electronics, fashion, and home.</p>
            <Link to="/deals" className="shopvault-hero-btn shopvault-hero-btn-light">
              Shop deals <ChevronRight size={16} strokeWidth={2} />
            </Link>
          </div>
          <div className="shopvault-deals-art">
            <img src={DEALS_IMAGE} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="shopvault-perks">
        <div className="shopvault-perks-inner">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="shopvault-perk">
              <div className="shopvault-perk-icon">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shopvault-cta">
        <h2>Your vault awaits.</h2>
        <p>Create a free account to save wishlists and track every order.</p>
        <div className="shopvault-hero-links">
          <Link to="/register" className="shopvault-hero-btn shopvault-hero-btn-primary">
            Create account
          </Link>
          <Link to="/shop" className="shopvault-hero-btn shopvault-hero-btn-secondary">
            Browse catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
