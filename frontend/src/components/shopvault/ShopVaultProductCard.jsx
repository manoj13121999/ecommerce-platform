import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { productImageFallback, resolveProductImage } from '../../utils/productImages';
import './ShopVaultProductCard.css';

export default function ShopVaultProductCard({ product }) {
  const fallback = productImageFallback(product.categoryName, product.categoryId);
  const [imageSrc, setImageSrc] = useState(() => resolveProductImage(product));

  return (
    <Link to={`/shop/products/${product.id}`} className="shopvault-product-card">
      <div className="shopvault-product-card-media">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImageSrc((current) => (current === fallback ? current : fallback))}
        />
      </div>
      <div className="shopvault-product-card-copy">
        <h3>{product.name}</h3>
        <p>From {formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
