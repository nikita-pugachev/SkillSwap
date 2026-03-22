import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/widgets';
import { getUsers } from '@/utils/api';
import { createHeaderUser, getAuthenticatedUserId, type HeaderUser } from '@/utils/auth';

import styles from './layout.module.scss';

type LayoutVariant = 'auth' | 'main';

interface LayoutProps {
  variant?: LayoutVariant;
  withFooter?: boolean;
  isAuthenticated?: boolean;
  user?: HeaderUser;
}

const CATALOG_SEARCH_QUERY_STORAGE_KEY = 'catalogSearchQuery';

const getPersistedSearchQuery = () => {
  return localStorage.getItem(CATALOG_SEARCH_QUERY_STORAGE_KEY) ?? '';
};

const Layout = ({ variant = 'main', withFooter = false, isAuthenticated, user }: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState(getPersistedSearchQuery);
  const [loadedUser, setLoadedUser] = useState<{
    id: number;
    data: HeaderUser | undefined;
  } | null>(null);

  const isAuthPage = variant === 'auth';
  const authenticatedUserId = getAuthenticatedUserId();
  const resolvedIsAuthenticated = isAuthenticated ?? authenticatedUserId !== null;
  const resolvedUser =
    user ??
    (resolvedIsAuthenticated &&
    !isAuthPage &&
    authenticatedUserId !== null &&
    loadedUser?.id === authenticatedUserId
      ? loadedUser.data
      : undefined);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      localStorage.removeItem(CATALOG_SEARCH_QUERY_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CATALOG_SEARCH_QUERY_STORAGE_KEY, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!resolvedIsAuthenticated || isAuthPage || !authenticatedUserId) {
      return;
    }

    const abortController = new AbortController();

    const loadAuthenticatedUser = async () => {
      try {
        const users = await getUsers({ signal: abortController.signal });
        const authenticatedUser = users.find((item) => item.id === authenticatedUserId);

        setLoadedUser({
          id: authenticatedUserId,
          data: authenticatedUser ? createHeaderUser(authenticatedUser) : undefined,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadedUser({
          id: authenticatedUserId,
          data: undefined,
        });
      }
    };

    loadAuthenticatedUser();

    return () => {
      abortController.abort();
    };
  }, [authenticatedUserId, isAuthPage, resolvedIsAuthenticated, user]);

  return (
    <div className={styles.wrapper}>
      <Header
        isAuthPage={isAuthPage}
        isAuthenticated={resolvedIsAuthenticated}
        user={resolvedUser}
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
