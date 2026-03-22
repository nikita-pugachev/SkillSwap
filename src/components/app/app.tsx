import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { ProtectedRoute } from '@/components/protected-route';

const Layout = lazy(() => import('../layout/layout'));
const CatalogPage = lazy(() => import('@/pages/catalog-page'));
const SkillPage = lazy(() => import('@/pages/skill-page'));
const LoginPage = lazy(() => import('@/pages/login-page'));
const RegisterPage = lazy(() => import('@/pages/register-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));
const FavoritesPage = lazy(() => import('@/pages/favorites-page'));
const CreatePage = lazy(() => import('@/pages/create-page'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

export default function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<Layout variant="main" withFooter />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/skill/:id" element={<SkillPage />} />
              <Route path="/error/:type" element={<ErrorPage />} />
              <Route path="*" element={<ErrorPage defaultType="notFoundError" />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/create" element={<CreatePage />} />
              </Route>
            </Route>

            <Route element={<Layout variant="auth" />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}
