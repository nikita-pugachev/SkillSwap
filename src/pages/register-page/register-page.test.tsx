import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './register-page';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

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
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const renderPage = () => render(<RegisterPage />);

  const fillStepOne = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'password123');
  };

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders first registration step with email and password fields', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Подтвердите пароль')).toBeInTheDocument();
  });

  it('shows password hint on the first step', () => {
    renderPage();

    expect(screen.getByText('Пароль должен содержать не менее 6 символов')).toBeInTheDocument();
  });

  it('renders social buttons and the next action', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
  });

  it('toggles the password visibility', () => {
    renderPage();
    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /показать пароль/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /скрыть пароль/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /скрыть пароль/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('moves to the second step after valid first-step data', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();
    });
  });

  it('moves back to the first step from step two', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
  });

  it('renders step two fields after completing step one', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

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

  it('renders step three fields after completing step two', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Имя'), 'Иван');
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 3 из 3' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Подкатегория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
  });

  it('shows inline validation errors for empty first-step fields', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(await screen.findByText('Введите email')).toBeInTheDocument();
    expect(await screen.findByText('Введите пароль')).toBeInTheDocument();
    expect(await screen.findByText('Подтвердите пароль', { selector: 'span' })).toBeInTheDocument();
  });

  it('shows mismatch error when passwords are different', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'password321');
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(await screen.findByText('Пароли не совпадают')).toBeInTheDocument();
  });

  it('shows duplicate email error when user already exists', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [
          {
            id: 1,
            name: 'Иван',
            email: 'test@example.com',
            password: 'password123',
            userAvatar: '/src/assets/user-avatars/ivan.png',
          },
        ],
      }),
    });

    renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(
      await screen.findByText('Пользователь с таким email уже существует')
    ).toBeInTheDocument();
  });

  it('shows name validation error on the second step', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    expect(await screen.findByText('Введите имя')).toBeInTheDocument();
  });

  it('creates account, logs in user and redirects after successful registration', async () => {
    const user = userEvent.setup();

    renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Имя'), 'Иван');
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 3 из 3' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    expect(localStorage.getItem('token')).toBe('mock-token-1001');
    expect(JSON.parse(localStorage.getItem('auth_user') ?? 'null')).toEqual({
      id: 1001,
      name: 'Иван',
      userAvatar: 'test-file-stub',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(JSON.parse(localStorage.getItem('registered_users') ?? '[]')).toEqual([
      expect.objectContaining({
        id: 1001,
        name: 'Иван',
        email: 'test@example.com',
        password: 'password123',
        userAvatar: 'test-file-stub',
      }),
    ]);
  });
});
