/**
 * @jest-environment jsdom
 */

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
  inputValue: string;
  selectedOption: TSelectOption | null;
  filteredOptions: TSelectOption[];
  shouldShowClear: boolean;
  actionAriaLabel: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleActionClick: () => void;
  handleSelectOption: (option: TSelectOption) => void;
};

jest.mock('../ui/SelectInputUI', () => ({
  SelectInputUI: ({
    placeholder,
    disabled,
    noOptionsText,
    isOpen,
    inputValue,
    selectedOption,
    filteredOptions,
    shouldShowClear,
    actionAriaLabel,
    rootRef,
    inputRef,
    handleInputChange,
    handleInputFocus,
    handleActionClick,
    handleSelectOption,
  }: MockSelectInputUIProps) => (
    <div ref={rootRef} data-testid="select-root">
      <input
        ref={inputRef}
        aria-label="select-input"
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />

      <button type="button" aria-label={actionAriaLabel} onClick={handleActionClick}>
        action
      </button>

      <div data-testid="selected-value">{selectedOption ? selectedOption.name : 'empty'}</div>

      {shouldShowClear ? <span data-testid="clear-visible">clear</span> : null}

      {isOpen ? (
        <div data-testid="dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button key={option.id} type="button" onClick={() => handleSelectOption(option)}>
                {option.name}
              </button>
            ))
          ) : (
            <div>{noOptionsText}</div>
          )}
        </div>
      ) : null}
    </div>
  ),
}));

beforeAll(() => {
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: (callback: (time: number) => void): number => {
      callback(0);
      return 0;
    },
  });
});

describe('SelectInput', () => {
  const options: TSelectOption[] = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Минск' },
    { id: 3, name: 'Тбилиси' },
  ];

  it('открывает список при фокусе на инпуте', () => {
    render(<SelectInput options={options} />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть список' })).toBeInTheDocument();
  });

  it('фильтрует опции по введённому значению без учёта регистра', () => {
    render(<SelectInput options={options} />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'мИн' } });

    expect(screen.getByText('Минск')).toBeInTheDocument();
    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
    expect(screen.queryByText('Тбилиси')).not.toBeInTheDocument();
  });

  it('показывает текст noOptionsText, если ничего не найдено', () => {
    render(<SelectInput options={options} noOptionsText="Совпадений нет" />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Париж' } });

    expect(screen.getByText('Совпадений нет')).toBeInTheDocument();
  });

  it('выбирает опцию, закрывает список и вызывает onChange', () => {
    const onChange = jest.fn<(option: TSelectOption | null) => void>();

    render(<SelectInput options={options} onChange={onChange} />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);
    fireEvent.click(screen.getByText('Минск'));

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Минск')).toBeInTheDocument();
    expect(screen.getByTestId('selected-value')).toHaveTextContent('Минск');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ id: 2, name: 'Минск' });
  });

  it('подставляет defaultValue при инициализации', () => {
    render(<SelectInput options={options} defaultValue="Тбилиси" />);

    expect(screen.getByDisplayValue('Тбилиси')).toBeInTheDocument();
    expect(screen.getByTestId('selected-value')).toHaveTextContent('Тбилиси');
    expect(screen.getByRole('button', { name: 'Очистить выбранное значение' })).toBeInTheDocument();
  });

  it('очищает выбранное значение по кнопке action и вызывает onChange(null)', () => {
    const onChange = jest.fn<(option: TSelectOption | null) => void>();

    render(<SelectInput options={options} defaultValue="Москва" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Очистить выбранное значение' }));

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByTestId('selected-value')).toHaveTextContent('empty');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('очищает поисковую строку, если список открыт и введён текст', () => {
    render(<SelectInput options={options} />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Мо' } });

    expect(screen.getByRole('button', { name: 'Очистить поиск' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }));

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('закрывает список и восстанавливает выбранное значение при клике вне компонента', () => {
    render(<SelectInput options={options} defaultValue="Москва" />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Ми' } });

    expect(screen.getByDisplayValue('Ми')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Москва')).toBeInTheDocument();
  });

  it('не открывает список и не даёт взаимодействовать, если disabled=true', () => {
    render(<SelectInput options={options} disabled />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Открыть список' }));

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
  });

  it('закрывает список по action-кнопке, если список открыт и строка пустая', () => {
    render(<SelectInput options={options} />);

    const input = screen.getByLabelText('select-input');
    fireEvent.focus(input);

    const button = screen.getByRole('button', { name: 'Закрыть список' });
    fireEvent.click(button);

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeInTheDocument();
  });
});
