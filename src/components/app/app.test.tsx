import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Suspense } from 'react';

jest.mock('@/pages/catalog-page', () => ({ default: () => <div>Catalog Page</div> }));
jest.mock('@/pages/login-page', () => ({ default: () => <div>Login Page</div> }));
jest.mock('@/pages/profile-page', () => ({ default: () => <div>Profile Page</div> }));
jest.mock('@/pages/ErrorPage', () => ({
  default: ({ defaultType }: { defaultType?: string }) => (
    <div>{defaultType === 'notFoundError' ? '404 Error Page' : 'Error Page'}</div>
  ),
}));

const renderAt = (path: string) => {
  const { Routes, Route } = jest.requireActual('react-router-dom');
  const CatalogPage = jest.requireMock('@/pages/catalog-page').default;
  const LoginPage = jest.requireMock('@/pages/login-page').default;
  const ProfilePage = jest.requireMock('@/pages/profile-page').default;
  const ErrorPage = jest.requireMock('@/pages/ErrorPage').default;

  const { ProtectedRoute } = jest.requireActual('@/components/protected-route');

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/error/:type" element={<ErrorPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
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

  it('renders ProfilePage when token and valid userId are present', () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', '7');
    renderAt('/profile');
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
