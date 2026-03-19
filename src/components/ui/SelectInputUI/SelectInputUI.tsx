import React from 'react';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton/IconButton';
import { ChevronIcon } from '../Icons/ChevronIcon';
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

  clearIconSrc: string;
  shouldShowClear: boolean;
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
  clearIconSrc,
  shouldShowClear,
  actionAriaLabel,
  handleInputChange,
  handleInputFocus,
  handleActionClick,
  handleSelectOption,
}) => {
  return (
    <div className={styles.selectBox}>
      {label && (
        <label htmlFor={id} className={styles.labelInput}>
          {label}
        </label>
      )}

      <div
        ref={rootRef}
        className={[
          styles.selectFrame,
          isOpen ? styles.selectFrameOpen : '',
          error ? styles.isError : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[styles.inputArea, isOpen ? styles.inputAreaOpen : '']
            .filter(Boolean)
            .join(' ')}
        >
          <InputUI
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            autoComplete="off"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />

          {shouldShowClear ? (
            <IconButton
              iconSrc={clearIconSrc}
              ariaLabel={actionAriaLabel}
              onClick={handleActionClick}
              className={styles.actionButton}
              type="button"
            />
          ) : (
            <button
              type="button"
              aria-label={actionAriaLabel}
              onClick={handleActionClick}
              className={styles.chevronButton}
              disabled={disabled}
            >
              <ChevronIcon isOpen={isOpen} />
            </button>
          )}
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
                    {option.name}
                  </button>
                );
              })
            ) : (
              <div className={styles.empty}>{noOptionsText}</div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className={styles.errorInput}>{error}</p>
      ) : hint ? (
        <p className={styles.hintInput}>{hint}</p>
      ) : null}
    </div>
  );
};
