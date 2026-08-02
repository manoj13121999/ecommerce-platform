import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import './PlaceholderPage.css';

export default function ShopPage() {
  return (
    <div className="placeholder-page">
      <div className="container">
        <div className="placeholder-card">
          <div className="placeholder-icon">
            <PackageOpen size={32} />
          </div>
          <h1>Shop coming soon</h1>
          <p>
            Product catalog, search, and filters will connect to the Catalog Service
            with Elasticsearch in Phase 2.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
