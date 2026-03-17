import React from 'react';
import { InputBaseContainerUI } from '../InputBaseContainerUI/InputBaseContainerUI';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton/IconButton';
import styles from './SelectInputUI.module.scss';
import type { TSelectOption } from '@/components/SelectInput/SelectInput';

type TSelectInputUIProps = {
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

  actionIconSrc: string;
  actionAriaLabel: string;

  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleActionClick: () => void;
  handleSelectOption: (option: TSelectOption) => void;
};

export const SelectInputUI: React.FC<TSelectInputUIProps> = ({
  id,
  label,
  error,
  hint,
  placeholder = 'Выберите значение',
  disabled = false,
  noOptionsText = 'Ничего не найдено',
  isOpen,
  rootRef,
  inputRef,
  inputValue,
  selectedOption,
  filteredOptions,
  actionIconSrc,
  actionAriaLabel,
  handleInputChange,
  handleInputFocus,
  handleActionClick,
  handleSelectOption,
}) => {
  return (
    <InputBaseContainerUI id={id} label={label} error={error} hint={hint}>
      <div ref={rootRef} className={styles.selectRoot}>
        <div className={styles.controlRow}>
          <InputUI
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            className={[styles.selectInput, isOpen ? styles.selectInputOpen : '']
              .filter(Boolean)
              .join(' ')}
            autoComplete="off"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />

          <IconButton
            iconSrc={actionIconSrc}
            ariaLabel={actionAriaLabel}
            onClick={handleActionClick}
            className={styles.actionButton}
            type="button"
          />
        </div>

        {isOpen && (
          <div className={styles.dropdown} role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.id === selectedOption?.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={[styles.option, isSelected ? styles.optionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelectOption(option)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.value}
                  </button>
                );
              })
            ) : (
              <div className={styles.empty}>{noOptionsText}</div>
            )}
          </div>
        )}
      </div>
    </InputBaseContainerUI>
  );
};
