import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Footer } from './Footer.jsx';
import styles from './Layout.module.css';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastPath, setLastPath] = useState(null);
  const location = useLocation();

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setSidebarOpen(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const close = (event) => event.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [sidebarOpen]);

  return (
    <div className={styles.shell}>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

      <div className={styles.body}>
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <div className={styles.main}>
          <main className={styles.content} key={location.pathname}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;
