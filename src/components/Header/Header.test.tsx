import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { type ButtonProps } from '../ui/ButtonUI/ButtonUI';

// мокаем компоненты которые тянут ассеты
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
  IconButton: () => <button data-testid="icon-button" />,
}));

jest.mock('../ui', () => ({
  Avatar: ({ name }: { name: string }) => <img alt={name} />,
}));

jest.mock('../ui/ButtonUI/ButtonUI', () => ({
  Button: ({ children, onClick }: ButtonProps) => <button onClick={onClick}>{children}</button>,
}));

import { Header, type HeaderProps } from './Header';

const mockUser: HeaderProps['user'] = {
  name: 'Тест Пользователь',
  avatar: '/avatar.png',
};

const renderHeader = (props: HeaderProps) =>
  render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>
  );

describe('Header component', () => {
  test('renders header', () => {
    renderHeader({ isLogin: false });

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    renderHeader({ isLogin: false });

    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });

  test('renders user info when user is logged in', () => {
    renderHeader({
      isLogin: true,
      user: mockUser,
    });

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.name)).toBeInTheDocument();
  });
});
