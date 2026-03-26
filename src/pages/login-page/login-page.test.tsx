import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './login-page';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    type = 'button',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
  InputUI: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  InputBaseContainerUI: ({
    label,
    id,
    error,
    children,
  }: {
    label: string;
    id: string;
    error?: string;
    children: ReactNode;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <span>{error}</span> : null}
    </div>
  ),
  IconButton: ({
    ariaLabel,
    onClick,
    className,
  }: {
    ariaLabel: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} className={className}>
      icon
    </button>
  ),
}));

describe('LoginPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders page title and onboarding text', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Вход', level: 1 })).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'С возвращением в SkillSwap!', level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Обменивайтесь знаниями и навыками с другими людьми')
    ).toBeInTheDocument();
  });

  it('renders social buttons, inputs and actions', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument();

    expect(screen.getByText('или')).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Введите email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите ваш пароль')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toHaveAttribute(
      'href',
      '/register'
    );
  });

  it('renders password input with type password by default', () => {
    renderPage();

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Показать пароль' })).toBeInTheDocument();
  });

  it('shows password text when toggle button is clicked', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Скрыть пароль' })).toBeInTheDocument();
  });

  it('hides password again when toggle button is clicked twice', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Скрыть пароль' }));
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Показать пароль' })).toBeInTheDocument();
  });
});
