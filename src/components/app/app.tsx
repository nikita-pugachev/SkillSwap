import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/services/store';
import type { RootState, AppDispatch } from '@/services/store';
import { login } from '@/services/slices/authSlice';
import { getToken, getStoredUser } from '@/utils/auth';

import { ProtectedRoute } from '@/components/protected-route';
import { Header } from '@/components/Header';

const CatalogPage = lazy(() => import('@/pages/catalog-page'));
const SkillPage = lazy(() => import('@/pages/skill-page'));
const LoginPage = lazy(() => import('@/pages/login-page'));
const RegisterPage = lazy(() => import('@/pages/register-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));
const FavoritesPage = lazy(() => import('@/pages/favorites-page'));
const CreatePage = lazy(() => import('@/pages/create-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector((state: RootState) => state.auth.user);
  const isLogin = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      dispatch(login(storedUser));
    }
  }, [dispatch]);

  const headerUser = authUser
    ? {
        name: authUser.name,
        avatar: authUser.userAvatar,
      }
    : undefined;

  return (
    <BrowserRouter>
      <Header isLogin={isLogin} user={headerUser} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/skill/:id" element={<SkillPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/create" element={<CreatePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
