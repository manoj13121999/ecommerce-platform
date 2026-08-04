import { useEffect, useState } from 'react';
import { Tags } from 'lucide-react';
import { catalogApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './DealsPage.css';

const PAGE_SIZE = 12;

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    catalogApi
      .getDeals({ page, size: PAGE_SIZE, sort: 'price_asc' })
      .then((response) => {
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load deals');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="deals-page">
      <section className="deals-hero">
        <div className="container">
          <div className="deals-hero-badge">
            <Tags size={16} />
            Limited-time offers
          </div>
          <h1>Today&apos;s best deals</h1>
          <p>
            Products with special pricing — save on top brands across every category.
          </p>
        </div>
      </section>

      <section className="container deals-content">
        {error && <div className="form-error">{error}</div>}

        {loading && (
          <div className="product-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="deals-empty">
            <p>No deals yet. Run <code>./scripts/mark-deals.sh</code> after seeding the catalog.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
