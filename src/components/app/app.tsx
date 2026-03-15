import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
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

export default function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header isLogin={false} />
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
    </Provider>
  );
}
