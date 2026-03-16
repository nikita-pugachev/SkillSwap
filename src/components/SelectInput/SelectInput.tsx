import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InputBaseContainerUI } from '../ui/InputBaseContainerUI';
import { InputUI } from '../ui/InputUI/InputUI';
import styles from './SelectInput.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  error,
  hint,
  placeholder = 'Выберите значение',
  options,
  value = '',
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange?.(newValue);
  };

  const handleSelect = (option: SelectOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <InputBaseContainerUI id={id} label={label} error={error} hint={hint}>
      <div ref={rootRef} className={styles.selectInput}>
        <InputUI
          id={id}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {isOpen && filteredOptions.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={styles.option}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </InputBaseContainerUI>
  );
};
