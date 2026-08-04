import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { catalogApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import { productImageFallback, resolveProductImage } from '../utils/productImages';
import './ProductDetailPage.css';

function isOnSale(product) {
  return product?.compareAtPrice != null && Number(product.compareAtPrice) > Number(product.price);
}

function discountPercent(product) {
  if (!isOnSale(product)) return 0;
  const original = Number(product.compareAtPrice);
  const current = Number(product.price);
  return Math.round(((original - current) / original) * 100);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      catalogApi.getProduct(id),
      catalogApi.getRelatedProducts(id, 4),
    ])
      .then(([productData, related]) => {
        setProduct(productData);
        setImageSrc(resolveProductImage(productData));
        setRelatedProducts(related);
      })
      .catch((err) => setError(err.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setCartMessage('');
    try {
      await addToCart(product, 1);
      setCartMessage('Added to your cart');
    } catch (err) {
      setCartMessage(err.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistBusy(true);
    setWishlistMessage('');
    try {
      const added = await toggleWishlist(product.id);
      setWishlistMessage(added ? 'Saved to wishlist' : 'Removed from wishlist');
    } catch (err) {
      setWishlistMessage(err.message || 'Could not update wishlist');
    } finally {
      setWishlistBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="container product-detail-page">
        <div className="product-detail-grid product-detail-loading">
          <ProductCardSkeleton />
          <div className="detail-skeleton-panel" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container product-detail-state">
        <p>{error || 'Product not found'}</p>
        <Link to="/shop" className="btn btn-primary">Back to shop</Link>
      </div>
    );
  }

  const onSale = isOnSale(product);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="container product-detail-page">
      <Link to="/shop" className="back-link">
        <ArrowLeft size={18} />
        Back to shop
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-gallery">
          <div className="product-detail-image">
            <img
              src={imageSrc}
              alt={product.name}
              onError={() => setImageSrc((current) => {
                const fallback = productImageFallback(product.categoryName, product.categoryId);
                return current === fallback ? current : fallback;
              })}
            />
            {onSale && (
              <span className="detail-sale-badge">-{discountPercent(product)}% off</span>
            )}
          </div>
        </div>

        <div className="product-detail-info">
          <span className="detail-category">{product.categoryName}</span>
          <h1>{product.name}</h1>

          <div className="detail-price-row">
            <p className="detail-price">{formatPrice(product.price)}</p>
            {onSale && (
              <p className="detail-compare-price">{formatPrice(product.compareAtPrice)}</p>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-meta">
            {product.stock > 0 ? (
              <span className="detail-stock in-stock">In stock · {product.stock} available</span>
            ) : (
              <span className="detail-stock out-of-stock">Currently unavailable</span>
            )}
          </div>

          <div className="detail-trust">
            <span><Truck size={16} /> Free delivery over ₹999</span>
            <span><RotateCcw size={16} /> 7-day returns</span>
            <span><ShieldCheck size={16} /> Secure checkout</span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg detail-add-btn"
              disabled={product.stock <= 0 || adding}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              {adding ? 'Adding...' : product.stock > 0 ? 'Add to cart' : 'Out of stock'}
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-lg wishlist-btn ${wishlisted ? 'active' : ''}`}
              disabled={wishlistBusy}
              onClick={handleToggleWishlist}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Saved' : 'Save item'}
            </button>
          </div>

          {cartMessage && <p className="detail-cart-message">{cartMessage}</p>}
          {wishlistMessage && <p className="detail-wishlist-message">{wishlistMessage}</p>}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You may also like</h2>
          <div className="product-grid related-product-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
