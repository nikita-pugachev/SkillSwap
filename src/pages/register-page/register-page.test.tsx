import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './register-page';

jest.mock('@/components/ui/ButtonUI', () => ({
  Button: ({
    children,
    type = 'button',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/InputUI', () => ({
  InputUI: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

jest.mock('@/components/ui/InputBaseContainerUI', () => ({
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
}));

jest.mock('@/components/ui/IconButton', () => ({
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

describe('RegisterPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

  it('renders step 1 by default', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();

    expect(screen.getByText('Добро пожаловать в SkillSwap!')).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
  });

  it('switches to step 2 on submit', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();

    expect(screen.getByText('Расскажите немного о себе')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });

  it('switches to step 3', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    expect(screen.getByRole('heading', { name: 'Шаг 3 из 3' })).toBeInTheDocument();

    expect(screen.getByText('Укажите, чем вы готовы поделиться')).toBeInTheDocument();
    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
  });

  it('goes back to previous step', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Скрыть пароль' }));
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password');
  });
});
