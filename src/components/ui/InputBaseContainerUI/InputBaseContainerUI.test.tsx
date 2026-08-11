import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputBaseContainerUI } from './InputBaseContainerUI';

describe('InputBaseContainerUI', () => {
  it('renders label and binds it to id', () => {
    render(
      <InputBaseContainerUI id="email" label="Email">
        <input id="email" />
      </InputBaseContainerUI>
    );

    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders children inside base wrapper', () => {
    render(
      <InputBaseContainerUI>
        <input aria-label="name-input" />
      </InputBaseContainerUI>
    );

    const input = screen.getByLabelText('name-input');
    expect(input).toBeInTheDocument();

    const wrapper = input.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass('inputBase');
    expect(wrapper).not.toHaveClass('inputBaseSearch');
  });

  it('adds search class when isSearch=true', () => {
    render(
      <InputBaseContainerUI isSearch>
        <input aria-label="search-input" />
      </InputBaseContainerUI>
    );

    const input = screen.getByLabelText('search-input');
    const wrapper = input.parentElement;

    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass('inputBase');
    expect(wrapper).toHaveClass('inputBaseSearch');
  });

  it('does not render label when label is not passed', () => {
    const { container } = render(
      <InputBaseContainerUI>
        <input aria-label="plain-input" />
      </InputBaseContainerUI>
    );

    expect(screen.getByLabelText('plain-input')).toBeInTheDocument();
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders hint only', () => {
    render(
      <InputBaseContainerUI hint="Hint text">
        <input aria-label="hint-input" />
      </InputBaseContainerUI>
    );

    const hint = screen.getByText('Hint text');
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('hintInput');
  });

  it('renders error only', () => {
    render(
      <InputBaseContainerUI error="Error text">
        <input aria-label="error-input" />
      </InputBaseContainerUI>
    );

    const error = screen.getByText('Error text');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('errorInput');
  });

  it('renders error instead of hint when both are passed', () => {
    render(
      <InputBaseContainerUI hint="Hint text" error="Error text">
        <input aria-label="hint-error-input" />
      </InputBaseContainerUI>
    );

    const error = screen.getByText('Error text');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('errorInput');
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
  });

  it('does not render message paragraph when hint and error are absent', () => {
    const { container } = render(
      <InputBaseContainerUI>
        <input aria-label="clean-input" />
      </InputBaseContainerUI>
    );

    expect(screen.getByLabelText('clean-input')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders root container with expected class', () => {
    const { container } = render(
      <InputBaseContainerUI>
        <input aria-label="root-input" />
      </InputBaseContainerUI>
    );

    expect(container.firstElementChild).toHaveClass('inputBaseContainer');
  });
});
