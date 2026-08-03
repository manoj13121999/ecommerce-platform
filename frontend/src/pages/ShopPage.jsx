import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { catalogApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import './ShopPage.css';

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialQuery = searchParams.get('q') || '';
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ? Number(initialCategory) : null,
  );
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [appliedInStockOnly, setAppliedInStockOnly] = useState(false);
  const [sort, setSort] = useState('name_asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query !== searchQuery) {
      setSearchQuery(query);
      setSearchInput(query);
      setPage(0);
    }
  }, [searchParams, searchQuery]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (searchQuery.trim()) {
        const response = await catalogApi.searchProducts(searchQuery.trim(), {
          page,
          size: PAGE_SIZE,
        });
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        const response = await catalogApi.getProducts({
          categoryId: selectedCategory,
          minPrice: appliedMinPrice ? Number(appliedMinPrice) : undefined,
          maxPrice: appliedMaxPrice ? Number(appliedMaxPrice) : undefined,
          inStock: appliedInStockOnly ? true : undefined,
          page,
          size: PAGE_SIZE,
          sort,
        });
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, page, sort, appliedMinPrice, appliedMaxPrice, appliedInStockOnly]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
    setSelectedCategory(null);
    setPage(0);
  }

  function handleCategoryClick(categoryId) {
    setSearchQuery('');
    setSearchInput('');
    setPage(0);
    setSelectedCategory((current) => (current === categoryId ? null : categoryId));
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(0);
  }

  function applyFilters(event) {
    event.preventDefault();
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setAppliedInStockOnly(inStockOnly);
    setPage(0);
  }

  const isSearchMode = Boolean(searchQuery.trim());
  const showingFrom = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const showingTo = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="container">
          <h1>Shop all products</h1>
          <p>Browse 5000+ products with pagination, sorting, filters, and Elasticsearch search.</p>
          <form className="shop-search" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search headphones, sneakers, yoga mat..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      </section>

      <section className="container shop-content">
        <aside className="shop-sidebar">
          <div className="sidebar-header">
            <SlidersHorizontal size={18} />
            <span>Categories</span>
          </div>
          <button
            type="button"
            className={`category-chip ${selectedCategory === null && !searchQuery ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setSearchInput('');
              setPage(0);
            }}
          >
            All products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span>{category.name}</span>
              <small>{category.productCount}</small>
            </button>
          ))}

          {!isSearchMode && (
            <form className="shop-filters" onSubmit={applyFilters}>
              <div className="sidebar-header">
                <span>Filters</span>
              </div>
              <label className="filter-label">
                Min price (₹)
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </label>
              <label className="filter-label">
                Max price (₹)
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In stock only
              </label>
              <button type="submit" className="btn btn-secondary btn-sm btn-full">
                Apply filters
              </button>
            </form>
          )}
        </aside>

        <div className="shop-results">
          <div className="shop-results-header">
            <div>
              <h2>{searchQuery ? `Results for "${searchQuery}"` : 'All products'}</h2>
              <p className="shop-results-meta">
                {totalElements > 0
                  ? `Showing ${showingFrom}-${showingTo} of ${totalElements.toLocaleString()} items`
                  : 'No items'}
              </p>
            </div>
            {!isSearchMode && (
              <select className="sort-select" value={sort} onChange={handleSortChange}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          {loading && (
            <div className="product-grid">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="shop-state">No products found. Try another search or category.</div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft size={16} />
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
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
