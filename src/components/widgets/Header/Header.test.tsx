import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { type ButtonProps } from '@/components/ui/ButtonUI/ButtonUI';

jest.mock('@/components/ui/Logo/Logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('@/components/SearchInput/SearchInput', () => ({
  SearchInput: () => <input data-testid="search-input" />,
}));

jest.mock('@/components/category-dropdown', () => ({
  CategoryDropdown: () => <div data-testid="category-dropdown" />,
}));

jest.mock('@/components/ui/IconButton', () => ({
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
    <button type="button" data-testid="icon-button" aria-label={ariaLabel} onClick={onClick} />
  ),
}));

jest.mock('@/components/ui', () => ({
  Avatar: ({ name }: { name: string }) => <img alt={name} />,
}));

jest.mock('@/components/ui/ButtonUI/ButtonUI', () => ({
  Button: ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>,
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

import { Header, type HeaderProps } from './Header';

const mockUser: HeaderProps['user'] = {
  name: 'Тест Пользователь',
  avatar: '/avatar.png',
};

const renderHeader = (props: HeaderProps, route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Header {...props} />
    </MemoryRouter>
  );

describe('Header component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders header', () => {
    renderHeader({ isAuthenticated: false });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    renderHeader({ isAuthenticated: false });
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
  });

  test('renders user info when user is logged in', () => {
    renderHeader({
      isAuthenticated: true,
      user: mockUser,
    });

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.name)).toBeInTheDocument();
  });

  test.each(['/login', '/register'])('renders close button on auth route %s', (route) => {
    renderHeader({ isAuthenticated: false, isAuthPage: true }, route);
    expect(screen.getByRole('button', { name: /закрыть/i })).toBeInTheDocument();
  });

  test('clicking close button calls navigate(-1)', async () => {
    const user = userEvent.setup();

    renderHeader({ isAuthenticated: false, isAuthPage: true }, '/login');

    await user.click(screen.getByRole('button', { name: /закрыть/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('clicking the favorites icon navigates to /favorites', async () => {
    const user = userEvent.setup();

    renderHeader({
      isAuthenticated: true,
      user: mockUser,
    });

    await user.click(screen.getByRole('button', { name: 'Избранное' }));

    expect(mockNavigate).toHaveBeenCalledWith('/favorites');
  });
});
