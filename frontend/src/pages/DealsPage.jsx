import { Link } from 'react-router-dom';
import { Tags } from 'lucide-react';
import './PlaceholderPage.css';

export default function DealsPage() {
  return (
    <div className="placeholder-page">
      <div className="container">
        <div className="placeholder-card">
          <div className="placeholder-icon">
            <Tags size={32} />
          </div>
          <h1>Deals coming soon</h1>
          <p>
            Flash sales and promotional pricing will appear here once the catalog
            and order services are integrated.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
