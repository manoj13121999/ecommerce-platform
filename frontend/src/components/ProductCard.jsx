import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';

function isOnSale(product) {
  return product.compareAtPrice != null && Number(product.compareAtPrice) > Number(product.price);
}

function discountPercent(product) {
  if (!isOnSale(product)) return 0;
  const original = Number(product.compareAtPrice);
  const current = Number(product.price);
  return Math.round(((original - current) / original) * 100);
}

export default function ProductCard({ product }) {
  const [imageSrc, setImageSrc] = useState(product.imageUrl || FALLBACK_IMAGE);
  const onSale = isOnSale(product);

  return (
    <Link to={`/shop/products/${product.id}`} className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
        <span className="product-card-category">{product.categoryName}</span>
        {onSale && <span className="product-card-sale">-{discountPercent(product)}%</span>}
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card-footer">
          <div className="product-card-prices">
            <strong>{formatPrice(product.price)}</strong>
            {onSale && (
              <span className="product-card-compare">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="in-stock">In stock</span>
          ) : (
            <span className="out-of-stock">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
