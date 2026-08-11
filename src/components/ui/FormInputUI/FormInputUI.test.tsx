import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  icon: unknown;
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
  IconButton: ({ onClick, type, ariaLabel }: IconButtonProps) => (
    <button data-testid="icon-button" type={type} onClick={onClick} aria-label={ariaLabel}>
      icon
    </button>
  ),
}));

describe('FormInputUI', () => {
  const handleChange = jest.fn();
  const handleShow = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <FormInputUI
        type="text"
        placeholder="Введите имя"
        value=""
        onChange={handleChange}
        onShow={handleShow}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит input с переданными пропсами', () => {
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

  it('вызывает onChange при вводе', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.type(screen.getByTestId('input-ui'), 'Мария');

    expect(handleChange).toHaveBeenCalled();
  });

  it('не рендерит кнопку показа пароля, если isPassword=false', () => {
    renderComponent({ isPassword: false });

    expect(screen.queryByTestId('icon-button')).not.toBeInTheDocument();
  });

  it('рендерит кнопку показа пароля, если isPassword=true', () => {
    renderComponent({
      type: 'password',
      placeholder: 'Введите пароль',
      isPassword: true,
    });

    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Показать или скрыть значение' })
    ).toBeInTheDocument();
  });

  it('вызывает onShow при клике на кнопку', async () => {
    const user = userEvent.setup();

    renderComponent({
      type: 'password',
      placeholder: 'Введите пароль',
      isPassword: true,
    });

    await user.click(screen.getByTestId('icon-button'));

    expect(handleShow).toHaveBeenCalledTimes(1);
  });

  it('по умолчанию не рендерит кнопку показа пароля', () => {
    renderComponent();

    expect(screen.queryByTestId('icon-button')).not.toBeInTheDocument();
  });
});
