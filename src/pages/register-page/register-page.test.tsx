import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './register-page';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

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
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    localStorage.clear();
  });

  it('renders first registration step with email and password fields', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });
});
