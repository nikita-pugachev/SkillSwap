import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header component', () => {
  test('renders header', () => {
    render(
      <MemoryRouter>
        <Header isLogin={false} />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    render(
      <MemoryRouter>
        <Header isLogin={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });

  test('renders user info when user is logged in', () => {
    render(
      <MemoryRouter>
        <Header isLogin={true} />
      </MemoryRouter>
    );

    expect(screen.getByText('Михаил')).toBeInTheDocument();
    expect(screen.getByAltText('Михаил')).toBeInTheDocument();
  });
});
