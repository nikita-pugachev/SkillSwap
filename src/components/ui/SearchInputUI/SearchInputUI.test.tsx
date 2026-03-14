import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInputUI } from './SearchInputUI';

describe('SearchInputUI', () => {
  it('рендерит компонент с плейсхолдером', () => {
    render(<SearchInputUI value="" onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByRole('searchbox', { name: 'Искать навык' })).toBeInTheDocument();
  });

  it('вызывает onChange при вводе текста', () => {
    const onChange = jest.fn();

    render(<SearchInputUI value="" onChange={onChange} onClear={jest.fn()} />);

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });
    fireEvent.change(input, { target: { value: 'React' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('не отображает кнопку очистки, если поле пустое', () => {
    render(<SearchInputUI value="" onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
  });

  it('отображает кнопку очистки, если в поле есть текст', () => {
    render(<SearchInputUI value="React" onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Очистить' })).toBeInTheDocument();
  });

  it('вызывает onClear по клику на кнопку очистки', () => {
    const onClear = jest.fn();

    render(<SearchInputUI value="React" onChange={jest.fn()} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('вызывает onSearch при нажатии Enter', () => {
    const onSearch = jest.fn();

    render(
      <SearchInputUI value="React" onChange={jest.fn()} onClear={jest.fn()} onSearch={onSearch} />
    );

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('React');
  });

  it('не вызывает onSearch при нажатии не Enter', () => {
    const onSearch = jest.fn();

    render(
      <SearchInputUI value="React" onChange={jest.fn()} onClear={jest.fn()} onSearch={onSearch} />
    );

    const input = screen.getByRole('searchbox', { name: 'Искать навык' });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(onSearch).not.toHaveBeenCalled();
  });
});
