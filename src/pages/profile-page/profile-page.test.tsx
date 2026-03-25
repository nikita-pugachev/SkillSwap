/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';

// Моки для UI-компонентов и иконок (необязательно, так как есть глобальный мок для svg?react)
jest.mock('@/components/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
  InputBaseContainerUI: ({ label, id, children }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  ),
  InputUI: (props: any) => <input {...props} />,
  IconButton: (props: any) => <button {...props}>icon</button>,
}));

jest.mock('@/components/Footer/Footer', () => ({
  Footer: () => <footer>Footer</footer>,
}));

describe('ProfilePage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

  it('рендерит страницу без ошибок', () => {
    renderPage();
    expect(screen.getByText('Личные данные')).toBeInTheDocument();
  });

  it('отображает имя пользователя (в поле ввода и в аватаре)', () => {
    renderPage();
    const nameInput = screen.getByLabelText('Имя') as HTMLInputElement;
    expect(nameInput.value).toBe('Пользователь');
    expect(screen.getByTestId('avatar')).toHaveTextContent('Пользователь');
  });

  it('отображает блоки навигации (пункты меню)', () => {
    renderPage();
    expect(screen.getByText('Заявки')).toBeInTheDocument();
    expect(screen.getByText('Мои обмены')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
    expect(screen.getByText('Мои навыки')).toBeInTheDocument();
    expect(screen.getByText('Личные данные')).toBeInTheDocument();
  });

  it('отображает кнопку "Сохранить"', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
  });

  it('отображает поля формы (почта, пароль, имя, дата рождения, пол, город, о себе)', () => {
    renderPage();
    expect(screen.getByLabelText('Почта')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument();
    expect(screen.getByLabelText('Пол')).toBeInTheDocument();
    expect(screen.getByLabelText('Город')).toBeInTheDocument();
    expect(screen.getByLabelText('О себе')).toBeInTheDocument();
  });

  it('пароль можно показать/скрыть', () => {
    renderPage();
    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /показать пароль/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /скрыть пароль/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /скрыть пароль/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /показать пароль/i })).toBeInTheDocument();
  });
});
