import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormInputUI } from './FormInputUI';

type InputUIProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  'aria-label': string;
  id?: string;
};

type IconButtonProps = {
  onClick: () => void;
  type: 'button';
  iconSrc: string;
  ariaLabel: string;
};

jest.mock('../InputUI/InputUI', () => ({
  InputUI: ({ type, placeholder, value, onChange, 'aria-label': ariaLabel, id }: InputUIProps) => (
    <input
      data-testid="input-ui"
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  ),
}));

jest.mock('../IconButton', () => ({
  IconButton: ({ onClick, type, iconSrc, ariaLabel }: IconButtonProps) => (
    <button
      data-testid="icon-button"
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      data-icon-src={iconSrc}
    >
      icon
    </button>
  ),
}));

describe('FormInputUI', () => {
  it('renders input with passed props', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="text"
        placeholder="Введите имя"
        value="Алексей"
        onChange={handleChange}
        onShow={handleShow}
        id="name"
      />
    );

    const input = screen.getByTestId('input-ui');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Введите имя');
    expect(input).toHaveAttribute('aria-label', 'Введите имя');
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveValue('Алексей');
  });

  it('calls onChange when input value changes', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="text"
        placeholder="Введите имя"
        value=""
        onChange={handleChange}
        onShow={handleShow}
      />
    );

    fireEvent.change(screen.getByTestId('input-ui'), {
      target: { value: 'Мария' },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not render IconButton when isPassword is false', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="text"
        placeholder="Введите имя"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        isPassword={false}
      />
    );

    expect(screen.queryByTestId('icon-button')).not.toBeInTheDocument();
  });

  it('renders IconButton when isPassword is true', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="password"
        placeholder="Введите пароль"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        isPassword
      />
    );

    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Показать или скрыть значение' })
    ).toBeInTheDocument();
  });

  it('calls onShow when IconButton is clicked', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="password"
        placeholder="Введите пароль"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        isPassword
      />
    );

    fireEvent.click(screen.getByTestId('icon-button'));

    expect(handleShow).toHaveBeenCalledTimes(1);
  });

  it('passes eye icon when value is hidden', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="password"
        placeholder="Введите пароль"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        isPassword
        isVisible={false}
      />
    );

    expect(screen.getByTestId('icon-button')).toHaveAttribute(
      'data-icon-src',
      '/src/assets/icons/eye.svg'
    );
  });

  it('passes slashed eye icon when value is visible', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="password"
        placeholder="Введите пароль"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        isPassword
        isVisible
      />
    );

    expect(screen.getByTestId('icon-button')).toHaveAttribute(
      'data-icon-src',
      '/src/assets/icons/eye-slach.svg'
    );
  });

  it('uses default values for optional props', () => {
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = jest.fn();
    const handleShow: () => void = jest.fn();

    render(
      <FormInputUI
        type="text"
        placeholder="Введите имя"
        value=""
        onChange={handleChange}
        onShow={handleShow}
      />
    );

    expect(screen.queryByTestId('icon-button')).not.toBeInTheDocument();
  });
});
