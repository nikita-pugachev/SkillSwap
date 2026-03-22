import { act, fireEvent, render, screen } from '@testing-library/react';

import { SearchInput } from './SearchInput';

jest.useFakeTimers();

describe('SearchInput', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders the search input', () => {
    render(<SearchInput />);

    expect(screen.getByRole('searchbox', { name: /Искать навык/i })).toBeInTheDocument();
  });

  it('updates the input value while typing', () => {
    render(<SearchInput />);

    const input = screen.getByRole('searchbox', { name: /Искать навык/i }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'React' } });

    expect(input.value).toBe('React');
  });

  it('shows a clear button when the field has a value', () => {
    render(<SearchInput />);

    fireEvent.change(screen.getByRole('searchbox', { name: /Искать навык/i }), {
      target: { value: 'React' },
    });

    expect(screen.getByRole('button', { name: /Очистить/i })).toBeInTheDocument();
  });

  it('clears the field when the clear button is clicked', () => {
    render(<SearchInput />);

    const input = screen.getByRole('searchbox', { name: /Искать навык/i }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.click(screen.getByRole('button', { name: /Очистить/i }));

    expect(input.value).toBe('');
    expect(screen.queryByRole('button', { name: /Очистить/i })).not.toBeInTheDocument();
  });

  it('calls onSearch only after the debounce delay', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: /Искать навык/i });

    fireEvent.change(input, { target: { value: 'R' } });
    fireEvent.change(input, { target: { value: 'Re' } });
    fireEvent.change(input, { target: { value: 'React' } });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('React');
  });

  it('reports an empty value after clearing the field', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: /Искать навык/i });

    fireEvent.change(input, { target: { value: 'React' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    fireEvent.click(screen.getByRole('button', { name: /Очистить/i }));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenLastCalledWith('');
  });

  it('does not call onSearch on the first render', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('syncs the input with an external value prop', () => {
    const { rerender } = render(<SearchInput value="React" />);

    const input = screen.getByRole('searchbox', { name: /Искать навык/i }) as HTMLInputElement;

    expect(input.value).toBe('React');

    rerender(<SearchInput value="" />);

    expect(input.value).toBe('');
  });
});
