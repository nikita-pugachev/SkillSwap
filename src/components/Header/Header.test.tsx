import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@/components/ui', () => ({
  Avatar: ({ name }: { name: string }) => <img alt={name} />,
  Logo: () => <div data-testid="logo" />,
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} />
  ),
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('../SearchInput', () => ({
  SearchInput: ({ className }: { className?: string }) => (
    <div data-testid="search-input" className={className} />
  ),
}));

jest.mock('../CategoryDropdown', () => ({
  CategoryDropdown: () => <div data-testid="category-dropdown" />,
}));

// Мокаем useNavigate, чтобы проверить navigate(-1)
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// Импорт компонента после моков
import { Header, type HeaderProps } from './Header';

// Тестовые данные
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

// Тесты
describe('Header component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = 'light';
    mockNavigate.mockClear();
  });

  test('renders header', () => {
    renderHeader({ isLogin: false });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    renderHeader({ isLogin: false });
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
  });

  test('renders user info when user is logged in', () => {
    renderHeader({
      isLogin: true,
      user: mockUser,
    });
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.name)).toBeInTheDocument();
  });

  test.each(['/login', '/register'])('renders close button on auth route %s', (route) => {
    renderHeader({ isLogin: false }, route);
    expect(screen.getByRole('button', { name: /закрыть/i })).toBeInTheDocument();
  });

  test('clicking close button calls navigate(-1)', async () => {
    const user = userEvent.setup();
    renderHeader({ isLogin: false }, '/login');

    const closeButton = screen.getByRole('button', { name: /закрыть/i });
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('clicking theme button toggles theme and saves to localStorage', async () => {
    const user = userEvent.setup();
    renderHeader({ isLogin: false });

    const toggleButton = screen.getByRole('button', { name: /смена темы/i });
    await user.click(toggleButton);

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
