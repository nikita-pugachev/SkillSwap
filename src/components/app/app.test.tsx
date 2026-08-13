import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { login, logout } from '@/services/slices/authSlice';
import { store } from '@/services/store';

jest.mock('@/pages/catalog-page', () => ({ default: () => <div>Catalog Page</div> }));
jest.mock('@/pages/error-page', () => ({
  default: ({ defaultType }: { defaultType?: string }) => (
    <div>{defaultType === 'notFoundError' ? '404 Error Page' : 'Error Page'}</div>
  ),
}));
jest.mock('@/pages/login-page', () => ({ default: () => <div>Login Page</div> }));
jest.mock('@/pages/profile-page', () => ({ default: () => <div>Profile Page</div> }));

const renderAt = (path: string) => {
  const { Route, Routes, Navigate } = jest.requireActual('react-router-dom');
  const { ProtectedRoute } = jest.requireActual('@/components/protected-route');

  const CatalogPage = jest.requireMock('@/pages/catalog-page').default;
  const ErrorPage = jest.requireMock('@/pages/error-page').default;
  const LoginPage = jest.requireMock('@/pages/login-page').default;
  const ProfilePage = jest.requireMock('@/pages/profile-page').default;

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/error/:type" element={<ErrorPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Navigate to="/profile/personal" replace />} />
              <Route path="/profile/:tab" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<ErrorPage defaultType="notFoundError" />} />
          </Routes>
        </Suspense>
      </MemoryRouter>
    </Provider>
  );
};

describe('Routing', () => {
  beforeEach(() => {
    localStorage.clear();
    store.dispatch(logout());
  });

  it('renders CatalogPage on "/"', () => {
    renderAt('/');
    expect(screen.getByText('Catalog Page')).toBeInTheDocument();
  });

  it('renders 404 ErrorPage on an unknown URL', () => {
    renderAt('/nonexistent-page');
    expect(screen.getByText('404 Error Page')).toBeInTheDocument();
  });

  it('redirects to /login when visiting /profile without a token', () => {
    renderAt('/profile');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to /login when userId is missing even if a token is present', () => {
    localStorage.setItem('token', 'mock-token');
    renderAt('/profile');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders ProfilePage when user is logged in via Redux', () => {
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

  it('renders ProfilePage when token and valid userId are present', () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', '7');

    renderAt('/profile');
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
