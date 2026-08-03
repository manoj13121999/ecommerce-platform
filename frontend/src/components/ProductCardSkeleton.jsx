import './ProductCardSkeleton.css';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line medium" />
      </div>
    </div>
  );
}
