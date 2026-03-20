import { act, fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './SearchInput';

jest.useFakeTimers();

describe('SearchInput', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('рендерит компонент', () => {
    render(<SearchInput />);

    expect(screen.getByRole('searchbox', { name: 'Искать навык' })).toBeInTheDocument();
  });

  it('обновляет значение инпута при вводе', () => {
    render(<SearchInput />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'React' } });

    expect(input.value).toBe('React');
  });

  it('показывает кнопку очистки при наличии текста', () => {
    render(<SearchInput />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });

    fireEvent.change(input, { target: { value: 'React' } });

    expect(screen.getByRole('button', { name: 'Очистить' })).toBeInTheDocument();
  });

  it('очищает поле по клику на кнопку очистки', () => {
    render(<SearchInput />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(input.value).toBe('');
    expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
  });

  it('вызывает onSearch только после паузы во вводе', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });

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

  it('при очистке input корректно сбрасывает значение поиска', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });

    fireEvent.change(input, { target: { value: 'React' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenLastCalledWith('');
  });

  it('не вызывает onSearch при первом рендере', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });
});
