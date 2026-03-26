import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './register-page';

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
    hint,
    children,
  }: {
    label: string;
    id: string;
    error?: string;
    hint?: string;
    children: ReactNode;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <span>{error}</span> : null}
      {!error && hint ? <span>{hint}</span> : null}
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

describe('RegisterPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

  it('рендерит страницу без ошибок', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
  });

  it('отображает поля Email и Пароль на первом шаге', () => {
    renderPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });

  it('поле Пароль имеет подсказку', () => {
    renderPage();
    expect(screen.getByText('Пароль должен содержать не менее 8 знаков')).toBeInTheDocument();
  });

  it('кнопка "Далее" присутствует', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
  });

  it('кнопки соцсетей присутствуют', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument();
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

  it('переход к следующему шагу по кнопке "Далее"', () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Далее' });
    fireEvent.click(nextButton);
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument();
  });

  it('переход на предыдущий шаг по кнопке "Назад" на шаге 2', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: 'Назад' });
    fireEvent.click(backButton);
    expect(screen.getByText('Шаг 1 из 3')).toBeInTheDocument();
  });

  it('отображает поля шага 2', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument();
    expect(screen.getByLabelText('Пол')).toBeInTheDocument();
    expect(screen.getByLabelText('Город')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Категория навыка, которому хотите научиться')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Подкатегория навыка, которому хотите научиться')
    ).toBeInTheDocument();
  });

  it('отображает поля шага 3', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Далее' }));
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }));
    expect(screen.getByText('Шаг 3 из 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Подкатегория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
  });
});
