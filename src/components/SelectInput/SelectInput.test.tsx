import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectInput, TSelectOption } from './SelectInput';

jest.mock('../../assets/icons/cross.svg', () => 'cross.svg');

type MockSelectInputUIProps = {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  noOptionsText?: string;
  isOpen: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  selectedOption: TSelectOption | null;
  filteredOptions: TSelectOption[];
  clearIconSrc: string;
  shouldShowClear: boolean;
  actionAriaLabel: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleActionClick: () => void;
  handleSelectOption: (option: TSelectOption) => void;
};

jest.mock('../ui/SelectInputUI', () => ({
  SelectInputUI: ({
    rootRef,
    inputRef,
    inputValue,
    filteredOptions,
    isOpen,
    noOptionsText,
    actionAriaLabel,
    handleInputChange,
    handleInputFocus,
    handleActionClick,
    handleSelectOption,
  }: MockSelectInputUIProps) => {
    return (
      <div ref={rootRef} data-testid="select-root">
        <input
          ref={inputRef}
          data-testid="select-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />

        <button type="button" onClick={handleActionClick} aria-label={actionAriaLabel}>
          action
        </button>

        {isOpen && (
          <ul data-testid="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.id}>
                  <button type="button" onClick={() => handleSelectOption(option)}>
                    {option.name}
                  </button>
                </li>
              ))
            ) : (
              <li>{noOptionsText}</li>
            )}
          </ul>
        )}
      </div>
    );
  },
}));

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0);
    return 0;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const options: TSelectOption[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Казань' },
];

describe('SelectInput', () => {
  it('показывает defaultValue при инициализации', () => {
    render(<SelectInput options={options} defaultValue="Казань" />);

    expect(screen.getByTestId('select-input')).toHaveValue('Казань');
    expect(screen.getByRole('button', { name: 'Очистить выбранное значение' })).toBeInTheDocument();
  });

  it('открывает список и фильтрует опции по введённому значению', () => {
    render(<SelectInput options={options} />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'сан' } });

    expect(screen.getByTestId('options-list')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Санкт-Петербург' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Москва' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Казань' })).not.toBeInTheDocument();
  });

  it('вызывает onChange с выбранной опцией при выборе элемента', () => {
    const onChange = jest.fn() as jest.MockedFunction<(option: TSelectOption | null) => void>;

    render(<SelectInput options={options} onChange={onChange} />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('button', { name: 'Москва' }));

    expect(input).toHaveValue('Москва');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ id: 1, name: 'Москва' });
  });

  it('очищает выбранное значение по кнопке action и вызывает onChange(null)', () => {
    const onChange = jest.fn() as jest.MockedFunction<(option: TSelectOption | null) => void>;

    render(<SelectInput options={options} defaultValue="Москва" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Очистить выбранное значение' }));

    expect(screen.getByTestId('select-input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('восстанавливает выбранное значение после клика вне компонента', () => {
    render(<SelectInput options={options} defaultValue="Москва" />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Каз' } });

    expect(input).toHaveValue('Каз');

    fireEvent.mouseDown(document.body);

    expect(input).toHaveValue('Москва');
    expect(screen.queryByTestId('options-list')).not.toBeInTheDocument();
  });

  it('не открывает список и не реагирует на action, если disabled=true', () => {
    render(<SelectInput options={options} disabled />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);

    expect(screen.queryByTestId('options-list')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Открыть список' }));

    expect(screen.queryByTestId('options-list')).not.toBeInTheDocument();
  });

  it('показывает noOptionsText, если ничего не найдено', () => {
    render(<SelectInput options={options} noOptionsText="Совпадений нет" />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Новосибирск' } });

    expect(screen.getByText('Совпадений нет')).toBeInTheDocument();
  });
});
