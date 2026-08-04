import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import ShopVaultFooter from './shopvault/ShopVaultFooter';

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={`app-shell${isHome ? ' home-style-shopvault' : ''}`}>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      {isHome ? <ShopVaultFooter /> : <Footer />}
    </div>
  );
}
