import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { InputUI } from './InputUI';

jest.mock('./InputUI.module.scss', () => ({
  __esModule: true,
  default: {
    input: 'input',
  },
}));

describe('InputUI', () => {
  it('renders input with default type="text"', () => {
    render(<InputUI aria-label="input" />);
    expect(screen.getByLabelText('input')).toHaveAttribute('type', 'text');
  });

  it('renders input with passed type', () => {
    render(<InputUI aria-label="password-input" type="password" />);
    expect(screen.getByLabelText('password-input')).toHaveAttribute('type', 'password');
  });

  it('passes id correctly', () => {
    render(<InputUI aria-label="email-input" id="email" />);
    expect(screen.getByLabelText('email-input')).toHaveAttribute('id', 'email');
  });

  it('applies base class from styles', () => {
    render(<InputUI aria-label="styled-input" />);
    expect(screen.getByLabelText('styled-input')).toHaveClass('input');
  });

  it('merges base class with custom className', () => {
    render(<InputUI aria-label="custom-class-input" className="customClass" />);

    const input = screen.getByLabelText('custom-class-input');
    expect(input).toHaveClass('input');
    expect(input).toHaveClass('customClass');
  });

  it('does not add empty className to class list', () => {
    render(<InputUI aria-label="empty-class-input" className="" />);
    expect(screen.getByLabelText('empty-class-input')).toHaveAttribute('class', 'input');
  });

  it('passes native input props through', () => {
    render(
      <InputUI
        aria-label="native-props-input"
        placeholder="Enter value"
        disabled
        name="testName"
        value="test value"
        readOnly
      />
    );

    const input = screen.getByLabelText('native-props-input');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('readonly');
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();

    render(<InputUI aria-label="change-input" onChange={handleChange} />);

    const input = screen.getByLabelText('change-input');
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to native input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<InputUI aria-label="ref-input" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByLabelText('ref-input'));
  });
});
