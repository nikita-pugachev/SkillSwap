import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
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

  it('вызывает onSearch при нажатии Enter', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('React');
  });

  it('не вызывает onSearch при нажатии не Enter', () => {
    const onSearch = jest.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(onSearch).not.toHaveBeenCalled();
  });
});
