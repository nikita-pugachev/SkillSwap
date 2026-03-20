import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectInput, TSelectOption } from './SelectInput';

type SelectInputUIMockProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled: boolean;
  noOptionsText: string;
  isOpen: boolean;
  rootRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  selectedOption: TSelectOption | null;
  filteredOptions: TSelectOption[];
  activeOptionIndex: number;
  clearIconSrc: string;
  shouldShowClear: boolean;
  actionAriaLabel: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleActionClick: () => void;
  handleSelectOption: (option: TSelectOption) => void;
};

jest.mock('../ui/SelectInputUI', () => ({
  SelectInputUI: ({
    id,
    isOpen,
    rootRef,
    inputRef,
    inputValue,
    selectedOption,
    filteredOptions,
    noOptionsText,
    actionAriaLabel,
    handleInputChange,
    handleInputFocus,
    handleInputKeyDown,
    handleActionClick,
    handleSelectOption,
  }: SelectInputUIMockProps) => (
    <div
      ref={rootRef}
      data-testid="select-root"
      data-is-open={String(isOpen)}
      data-input-value={inputValue}
      data-selected-value={selectedOption?.name ?? ''}
    >
      <input
        id={id}
        ref={inputRef}
        data-testid="select-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
      />

      <button
        type="button"
        data-testid="action-button"
        aria-label={actionAriaLabel}
        onClick={handleActionClick}
      >
        action
      </button>

      <div data-testid="options-list">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              data-testid={`option-${option.id}`}
              onClick={() => handleSelectOption(option)}
            >
              {option.name}
            </button>
          ))
        ) : (
          <span>{noOptionsText}</span>
        )}
      </div>
    </div>
  ),
}));

describe('SelectInput', () => {
  const options: TSelectOption[] = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Самара' },
    { id: 3, name: 'Томск' },
  ];

  it('фильтрует значения по порядку символов: при вводе "мо" подходит только "Москва"', () => {
    render(<SelectInput id="city" options={options} />);

    const input = screen.getByTestId('select-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'мо' } });

    expect(screen.getByTestId('select-root')).toHaveAttribute('data-is-open', 'true');
    expect(screen.getByTestId('option-1')).toHaveTextContent('Москва');
    expect(screen.queryByTestId('option-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('option-3')).not.toBeInTheDocument();
  });

  it('по action-кнопке очищает только input, оставляет список открытым и сохраняет selectedOption', () => {
    render(<SelectInput id="city" options={options} defaultValue="Самара" />);

    const input = screen.getByTestId('select-input');
    const actionButton = screen.getByTestId('action-button');
    const root = screen.getByTestId('select-root');

    fireEvent.focus(input);

    expect(root).toHaveAttribute('data-is-open', 'true');
    expect(root).toHaveAttribute('data-input-value', 'Самара');
    expect(root).toHaveAttribute('data-selected-value', 'Самара');

    fireEvent.click(actionButton);

    expect(root).toHaveAttribute('data-is-open', 'true');
    expect(root).toHaveAttribute('data-input-value', '');
    expect(root).toHaveAttribute('data-selected-value', 'Самара');
  });
});
