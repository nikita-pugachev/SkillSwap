import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/widgets';

import styles from './layout.module.scss';

type LayoutVariant = 'auth' | 'main';

interface LayoutProps {
  variant?: LayoutVariant;
  withFooter?: boolean;
}

const CATALOG_SEARCH_QUERY_STORAGE_KEY = 'catalogSearchQuery';

const getPersistedSearchQuery = () => {
  return localStorage.getItem(CATALOG_SEARCH_QUERY_STORAGE_KEY) ?? '';
};

const Layout = ({ variant = 'main', withFooter = false }: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState(getPersistedSearchQuery);

  const isAuthPage = variant === 'auth';

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      localStorage.removeItem(CATALOG_SEARCH_QUERY_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CATALOG_SEARCH_QUERY_STORAGE_KEY, searchQuery);
  }, [searchQuery]);

  return (
    <div className={styles.wrapper}>
      <Header
        isAuthPage={isAuthPage}
        searchValue={isAuthPage ? undefined : searchQuery}
        onSearch={isAuthPage ? undefined : setSearchQuery}
      />

      <main className={styles.main}>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>

      {withFooter && <Footer />}
    </div>
  );
};

export default Layout;
