import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { type ButtonProps } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/services/hooks';

jest.mock('@/services/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/services/selectors', () => ({
  selectUser: (state: MockState) => state.auth.user,
  selectIsAuthenticated: (state: MockState) => state.auth.isAuthenticated,
}));

jest.mock('@/services/slices/authSlice', () => ({
  logout: () => ({ type: 'auth/logout' }),
}));

jest.mock('@/components/ui/Logo/Logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('@/components/SearchInput/SearchInput', () => ({
  SearchInput: () => <input data-testid="search-input" />,
}));

jest.mock('@/components/CategoryDropdown', () => ({
  CategoryDropdown: () => <div data-testid="category-dropdown" />,
}));

jest.mock('@/components/ui/IconButton', () => ({
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} />
  ),
}));

jest.mock('@/components/ui', () => ({
  Avatar: ({ name }: { name: string }) => <img alt={name} />,
  Button: ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>,
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

import { Header, type HeaderProps } from './Header';

const mockedUseAppSelector = useAppSelector as unknown as jest.MockedFunction<
  typeof useAppSelector
>;
const mockedUseAppDispatch = useAppDispatch as unknown as jest.MockedFunction<
  typeof useAppDispatch
>;

const mockUser = {
  id: 1,
  name: 'Анна',
  userAvatar: '/avatar.png',
};

type MockState = {
  auth: {
    isAuthenticated: boolean;
    user: typeof mockUser | null;
  };
};

const createMockState = ({
  isAuthenticated = false,
  user = null,
}: {
  isAuthenticated?: boolean;
  user?: typeof mockUser | null;
} = {}): MockState => ({
  auth: {
    isAuthenticated,
    user,
  },
});

const setupSelectors = (state: MockState) => {
  mockedUseAppSelector.mockImplementation((selector) => selector(state as never));
};

const renderHeader = (props: HeaderProps = {}, route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Header {...props} />
    </MemoryRouter>
  );

describe('Header component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = 'light';
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    mockedUseAppSelector.mockReset();
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    setupSelectors(createMockState());
  });

  test('renders header', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    setupSelectors(createMockState({ isAuthenticated: false, user: null }));

    renderHeader();

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
  });

  test('renders user info when user is logged in', () => {
    setupSelectors(createMockState({ isAuthenticated: true, user: mockUser }));

    renderHeader();

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.name)).toBeInTheDocument();
  });

  test('renders profile button instead of auth buttons while user data is loading', () => {
    setupSelectors(createMockState({ isAuthenticated: true, user: null }));

    renderHeader();

    expect(screen.getByRole('button', { name: 'Профиль' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Зарегистрироваться' })).not.toBeInTheDocument();
  });

  test.each(['/login', '/register'])('renders close button on auth route %s', (route) => {
    renderHeader({ isAuthPage: true }, route);
    expect(screen.getByRole('button', { name: /закрыть/i })).toBeInTheDocument();
  });

  test('clicking close button calls navigate(-1)', async () => {
    const user = userEvent.setup();

    renderHeader({ isAuthPage: true }, '/login');

    await user.click(screen.getByRole('button', { name: /закрыть/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('clicking the favorites icon navigates to /favorites', async () => {
    const user = userEvent.setup();
    setupSelectors(createMockState({ isAuthenticated: true, user: mockUser }));

    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Избранное' }));

    expect(mockNavigate).toHaveBeenCalledWith('/favorites');
  });

  test('clicking theme button toggles theme and saves to localStorage', async () => {
    const user = userEvent.setup();

    renderHeader();

    const toggleButton = screen.getByRole('button', { name: /смена темы/i });
    await user.click(toggleButton);

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
