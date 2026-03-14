import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormInput } from './FormInput';

type InputBaseContainerUIProps = {
  children: React.ReactNode;
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
};

type FormInputUIProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShow: () => void;
  isVisible: boolean;
  isPassword: boolean;
  id?: string;
};

jest.mock('../ui/InputBaseContainerUI', () => ({
  InputBaseContainerUI: ({ children, id, label, error, hint }: InputBaseContainerUIProps) => (
    <div data-testid="input-base-container" data-id={id}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      {children}
      {error ? <span>{error}</span> : null}
      {hint ? <span>{hint}</span> : null}
    </div>
  ),
}));

jest.mock('../ui/FormInputUI/FormInputUI', () => ({
  FormInputUI: ({
    type,
    placeholder,
    value,
    onChange,
    onShow,
    isVisible,
    isPassword,
    id,
  }: FormInputUIProps) => (
    <div>
      <input
        data-testid="form-input-ui"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {isPassword ? (
        <button type="button" onClick={onShow}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      ) : null}
    </div>
  ),
}));

describe('FormInput', () => {
  it('renders input with placeholder', () => {
    render(<FormInput type="text" placeholder="Введите имя" />);

    expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
  });

  it('updates value on change', () => {
    render(<FormInput type="text" placeholder="Введите имя" />);

    const input = screen.getByPlaceholderText('Введите имя') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Алексей' } });

    expect(input.value).toBe('Алексей');
  });

  it('renders label, error and hint', () => {
    render(
      <FormInput
        type="text"
        placeholder="Введите имя"
        id="name"
        label="Имя"
        error="Поле обязательно"
        hint="Введите полное имя"
      />
    );

    expect(screen.getByText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Поле обязательно')).toBeInTheDocument();
    expect(screen.getByText('Введите полное имя')).toBeInTheDocument();
  });

  it('renders password input with type=password by default', () => {
    render(<FormInput type="password" placeholder="Введите пароль" />);

    const input = screen.getByPlaceholderText('Введите пароль');

    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility', () => {
    render(<FormInput type="password" placeholder="Введите пароль" />);

    const input = screen.getByPlaceholderText('Введите пароль');
    const toggleButton = screen.getByRole('button', { name: 'Show' });

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not render visibility toggle button for non-password input', () => {
    render(<FormInput type="email" placeholder="Введите email" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('passes id to input', () => {
    render(<FormInput type="text" placeholder="Введите имя" id="username" />);

    expect(screen.getByPlaceholderText('Введите имя')).toHaveAttribute('id', 'username');
  });
});
