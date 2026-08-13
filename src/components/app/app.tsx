import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';

import { store } from '@/services/store';
import type { AppDispatch } from '@/services/store';
import { login } from '@/services/slices/authSlice';
import { getToken, getStoredUser } from '@/utils/auth';

import { ProtectedRoute } from '@/components/protected-route';
import { ToastProvider } from '@/components/providers/ToastProvider';

const Layout = lazy(() => import('../layout/layout'));

const CatalogPage = lazy(() => import('@/pages/catalog-page'));
const SkillPage = lazy(() => import('@/pages/skill-page'));
const LoginPage = lazy(() => import('@/pages/login-page'));
const RegisterPage = lazy(() => import('@/pages/register-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));
const CreatePage = lazy(() => import('@/pages/create-page'));
const ErrorPage = lazy(() => import('@/pages/error-page'));

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      dispatch(login(storedUser));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Layout variant="main" withFooter />}>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/skill/:id" element={<SkillPage />} />
            <Route path="/error/:type" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage defaultType="notFoundError" />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Navigate to="/profile/personal" replace />} />
              <Route path="/profile/:tab" element={<ProfilePage />} />
              <Route path="/favorites" element={<Navigate to="/profile/favorites" replace />} />
              <Route path="/create" element={<CreatePage />} />
            </Route>
          </Route>

          <Route element={<Layout variant="auth" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Suspense>

      <ToastProvider />
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
