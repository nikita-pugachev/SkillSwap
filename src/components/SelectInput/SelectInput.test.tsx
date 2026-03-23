import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectInput } from './SelectInput';
import { TSelectOption } from '@/utils/types';

type SelectInputUIMockProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled: boolean;
  noOptionsText: string;
  isOpen: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
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
      data-testid={`select-root-${id}`}
      data-is-open={String(isOpen)}
      data-input-value={inputValue}
      data-selected-value={selectedOption?.name ?? ''}
    >
      <input
        id={id}
        ref={inputRef}
        data-testid={`select-input-${id}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
      />

      <button
        type="button"
        data-testid={`action-button-${id}`}
        aria-label={actionAriaLabel}
        onClick={handleActionClick}
      >
        action
      </button>

      <div data-testid={`options-list-${id}`}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              data-testid={`option-${id}-${option.id}`}
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
  const cityOptions: TSelectOption[] = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Самара' },
    { id: 3, name: 'Томск' },
  ];

  const genderOptions: TSelectOption[] = [
    { id: 1, name: 'Мужской' },
    { id: 2, name: 'Женский' },
  ];

  it('фильтрует значения по порядку символов: при вводе "мо" подходит только "Москва"', () => {
    render(<SelectInput id="city" options={cityOptions} />);

    const input = screen.getByTestId('select-input-city');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'мо' } });

    expect(screen.getByTestId('select-root-city')).toHaveAttribute('data-is-open', 'true');
    expect(screen.getByTestId('option-city-1')).toHaveTextContent('Москва');
    expect(screen.queryByTestId('option-city-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('option-city-3')).not.toBeInTheDocument();
  });

  it('по action-кнопке очищает только input, оставляет список открытым и сохраняет selectedOption', () => {
    render(<SelectInput id="city" options={cityOptions} defaultValue="Самара" />);

    const input = screen.getByTestId('select-input-city');
    const actionButton = screen.getByTestId('action-button-city');
    const root = screen.getByTestId('select-root-city');

    fireEvent.focus(input);

    expect(root).toHaveAttribute('data-is-open', 'true');
    expect(root).toHaveAttribute('data-input-value', 'Самара');
    expect(root).toHaveAttribute('data-selected-value', 'Самара');

    fireEvent.click(actionButton);

    expect(root).toHaveAttribute('data-is-open', 'true');
    expect(root).toHaveAttribute('data-input-value', '');
    expect(root).toHaveAttribute('data-selected-value', 'Самара');
  });

  it('в controlled-режиме при открытии одного селекта закрывает другой', () => {
    const ControlledForm = () => {
      const [openSelectId, setOpenSelectId] = useState<string | null>(null);

      return (
        <>
          <SelectInput
            id="gender"
            options={genderOptions}
            isOpen={openSelectId === 'gender'}
            onToggle={(next) => setOpenSelectId(next ? 'gender' : null)}
          />

          <SelectInput
            id="city"
            options={cityOptions}
            isOpen={openSelectId === 'city'}
            onToggle={(next) => setOpenSelectId(next ? 'city' : null)}
          />
        </>
      );
    };

    render(<ControlledForm />);

    const genderInput = screen.getByTestId('select-input-gender');
    const cityInput = screen.getByTestId('select-input-city');

    const genderRoot = screen.getByTestId('select-root-gender');
    const cityRoot = screen.getByTestId('select-root-city');

    expect(genderRoot).toHaveAttribute('data-is-open', 'false');
    expect(cityRoot).toHaveAttribute('data-is-open', 'false');

    fireEvent.focus(genderInput);

    expect(genderRoot).toHaveAttribute('data-is-open', 'true');
    expect(cityRoot).toHaveAttribute('data-is-open', 'false');

    fireEvent.focus(cityInput);

    expect(genderRoot).toHaveAttribute('data-is-open', 'false');
    expect(cityRoot).toHaveAttribute('data-is-open', 'true');
  });
});
