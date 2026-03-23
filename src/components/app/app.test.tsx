import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Suspense } from 'react';
import { login } from '@/services/slices/authSlice';

jest.mock('@/pages/catalog-page', () => ({ default: () => <div>Catalog Page</div> }));
jest.mock('@/pages/not-found-page', () => ({ default: () => <div>Страница не найдена</div> }));
jest.mock('@/pages/login-page', () => ({ default: () => <div>Login Page</div> }));
jest.mock('@/pages/profile-page', () => ({ default: () => <div>Profile Page</div> }));

const renderAt = (path: string) => {
  const { Routes, Route } = jest.requireActual('react-router-dom');
  const CatalogPage = jest.requireMock('@/pages/catalog-page').default;
  const NotFoundPage = jest.requireMock('@/pages/not-found-page').default;
  const LoginPage = jest.requireMock('@/pages/login-page').default;
  const ProfilePage = jest.requireMock('@/pages/profile-page').default;

  const { ProtectedRoute } = jest.requireActual('@/components/protected-route');

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </MemoryRouter>
    </Provider>
  );
};

describe('Routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('рендерит CatalogPage на "/"', () => {
    renderAt('/');
    expect(screen.getByText('Catalog Page')).toBeInTheDocument();
  });

  it('рендерит NotFoundPage на несуществующем URL', () => {
    renderAt('/nonexistent-page');
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
  });

  it('редиректит на /login при переходе на /profile без токена', () => {
    renderAt('/profile');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('рендерит ProfilePage при наличии токена', () => {
    store.dispatch(
      login({
        id: 1,
        name: 'Test User',
        userAvatar: '/test-avatar.png',
      })
    );

    renderAt('/profile');
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
