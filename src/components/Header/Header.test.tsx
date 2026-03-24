import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { type ButtonProps } from '../ui/ButtonUI/ButtonUI';

// ----------------------
// Моки для всех компонентов, которые тянут ассеты
// ----------------------
jest.mock('../ui/Logo/Logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('../SearchInput/SearchInput', () => ({
  SearchInput: () => <input data-testid="search-input" />,
}));

jest.mock('../category-dropdown', () => ({
  CategoryDropdown: () => <div data-testid="category-dropdown" />,
}));

jest.mock('../ui/IconButton', () => ({
  IconButton: ({ onClick, ariaLabel }: { onClick?: () => void; ariaLabel: string }) => (
    <button onClick={onClick} aria-label={ariaLabel} data-testid="icon-button" />
  ),
}));

jest.mock('../ui', () => ({
  Avatar: ({ name }: { name: string }) => <img alt={name} />,
}));

jest.mock('../ui/ButtonUI/ButtonUI', () => ({
  Button: ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>,
}));

// ----------------------
// Мокаем useNavigate, чтобы проверить navigate(-1)
// ----------------------
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// ----------------------
// Импорт компонента после моков
// ----------------------
import { Header, type HeaderProps } from './Header';

// ----------------------
// Тестовые данные
// ----------------------
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

// ----------------------
// Тесты
// ----------------------
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
