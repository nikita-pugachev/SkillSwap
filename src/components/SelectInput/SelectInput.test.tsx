import { render, screen, fireEvent } from '@testing-library/react';
import { SelectInput, type TSelectOption } from './SelectInput';

jest.mock('../../assets/icons/cross.svg', () => ({
  __esModule: true,
  default: 'mock-clear-icon.svg',
}));

describe('SelectInput', () => {
  const options: TSelectOption[] = [
    { id: 1, value: 'Москва' },
    { id: 2, value: 'Санкт-Петербург' },
    { id: 3, value: 'Новосибирск' },
  ];

  const createProps = () => ({
    id: 'city',
    label: 'Город',
    error: '',
    hint: 'Выберите город',
    placeholder: 'Не указан',
    options,
    defaultValue: '',
    onChange: jest.fn(),
    disabled: false,
    noOptionsText: 'Ничего не найдено',
  });

  beforeEach(() => {
    Object.defineProperty(window, 'requestAnimationFrame', {
      writable: true,
      value: (callback: (time: number) => void): number => {
        callback(0);
        return 0;
      },
    });
  });

  it('рендерит label, input и hint', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    expect(screen.getByText('Город')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Выберите город')).toBeInTheDocument();
  });

  it('устанавливает defaultValue как выбранное значение', () => {
    const props = createProps();
    props.defaultValue = 'Санкт-Петербург';

    render(<SelectInput {...props} />);

    expect(screen.getByRole('combobox')).toHaveValue('Санкт-Петербург');
    expect(screen.getByRole('button', { name: 'Очистить выбранное значение' })).toBeInTheDocument();
  });

  it('открывает список по фокусу на input', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть список' })).toBeInTheDocument();
  });

  it('фильтрует опции по введенному значению', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'моск' } });

    expect(screen.getByRole('option', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Санкт-Петербург' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Новосибирск' })).not.toBeInTheDocument();
  });

  it('показывает noOptionsText, если ничего не найдено', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'xxx' } });

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('выбирает опцию и вызывает onChange', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('option', { name: 'Москва' }));

    expect(input).toHaveValue('Москва');
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith({ id: 1, value: 'Москва' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('очищает поиск при клике на action-кнопку, когда список открыт и есть inputValue', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Мос' } });

    const clearButton = screen.getByRole('button', { name: 'Очистить поиск' });
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(props.onChange).not.toHaveBeenCalled();
  });

  it('очищает выбранное значение и вызывает onChange(null)', () => {
    const props = createProps();
    props.defaultValue = 'Москва';

    render(<SelectInput {...props} />);

    const clearButton = screen.getByRole('button', {
      name: 'Очистить выбранное значение',
    });

    fireEvent.click(clearButton);

    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(null);
  });

  it('закрывает открытый список и восстанавливает выбранное значение, если inputValue пустой', () => {
    const props = createProps();
    props.defaultValue = 'Москва';

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'тест' } });
    fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }));
    expect(input).toHaveValue('');

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть список' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('Москва');
  });

  it('закрывает список по клику вне компонента и восстанавливает выбранное значение', () => {
    const props = createProps();
    props.defaultValue = 'Москва';

    render(
      <div>
        <SelectInput {...props} />
        <button type="button">outside</button>
      </div>
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Мос' } });

    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('Москва');
  });

  it('не открывает список и не дает взаимодействовать при disabled=true', () => {
    const props = createProps();
    props.disabled = true;

    render(<SelectInput {...props} />);

    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();

    fireEvent.focus(input);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    const actionButton = screen.getByRole('button', { name: 'Открыть список' });
    expect(actionButton).toBeDisabled();
  });

  it('показывает error вместо hint', () => {
    const props = createProps();
    props.error = 'Поле обязательно';

    render(<SelectInput {...props} />);

    expect(screen.getByText('Поле обязательно')).toBeInTheDocument();
    expect(screen.queryByText('Выберите город')).not.toBeInTheDocument();
  });

  it('корректно меняет aria-label у action-кнопки', () => {
    const props = createProps();

    render(<SelectInput {...props} />);

    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getByRole('button', { name: 'Закрыть список' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Мос' } });

    expect(screen.getByRole('button', { name: 'Очистить поиск' })).toBeInTheDocument();
  });
});
