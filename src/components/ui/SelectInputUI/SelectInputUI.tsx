import React, { useMemo } from 'react';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton/IconButton';
import { ChevronIcon } from '../Icons/ChevronIcon';
import styles from './SelectInputUI.module.scss';
import type { TSelectOption } from '@/components/SelectInput/SelectInput';

type TSelectInputUIProps = {
  id: string;
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
  activeOptionIndex,
  clearIconSrc,
  shouldShowClear,
  actionAriaLabel,
  handleInputChange,
  handleInputFocus,
  handleInputKeyDown,
  handleActionClick,
  handleSelectOption,
}) => {
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const activeOption = activeOptionIndex >= 0 ? filteredOptions[activeOptionIndex] : null;

  const activeDescendant = isOpen && activeOption ? `${id}-option-${activeOption.id}` : undefined;

  const describedBy = useMemo(() => {
    const ids: string[] = [];

    if (hint && !error) {
      ids.push(hintId);
    }

    if (error) {
      ids.push(errorId);
    }

    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [hint, error, hintId, errorId]);

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
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
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
          <div
            id={listboxId}
            className={styles.dropdown}
            role="listbox"
            aria-label={label || placeholder}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = option.id === selectedOption?.id;
                const isActive = index === activeOptionIndex;

                return (
                  <button
                    key={option.id}
                    id={`${id}-option-${option.id}`}
                    type="button"
                    className={[styles.option, isSelected ? styles.optionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelectOption(option)}
                    role="option"
                    aria-selected={isActive}
                  >
                    {option.name}
                  </button>
                );
              })
            ) : (
              <div className={styles.empty} aria-live="polite">
                {noOptionsText}
              </div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className={styles.errorInput} aria-live="polite">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={styles.hintInput}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
