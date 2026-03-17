import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clearIconSrc from '../../assets/icons/cross.svg';
import arrowUpIconSrc from '../../assets/icons/chevron-up.svg';
import arrowDownIconSrc from '../../assets/icons/chevron-down.svg';
import { SelectInputUI } from '../ui/SelectInputUI';

export type TSelectOption = {
  id: number;
  value: string;
};

export type TSelectInputProps = {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: TSelectOption[];
  defaultValue?: string;
  onChange?: (option: TSelectOption | null) => void;
  disabled?: boolean;
  noOptionsText?: string;
};

export const SelectInput: React.FC<TSelectInputProps> = ({
  id,
  label,
  error,
  hint,
  placeholder = 'Не указан',
  options,
  defaultValue = '',
  onChange,
  disabled = false,
  noOptionsText = 'Ничего не найдено',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultSelectedOption = useMemo(
    () => options.find((option) => option.value === defaultValue) ?? null,
    [options, defaultValue]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TSelectOption | null>(defaultSelectedOption);
  const [inputValue, setInputValue] = useState(defaultSelectedOption?.value ?? '');

  const filteredOptions = useMemo(() => {
    const normalized = inputValue.trim().toLowerCase();

    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.value.toLowerCase().includes(normalized));
  }, [inputValue, options]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const restoreSelectedValue = useCallback(() => {
    setInputValue(selectedOption?.value ?? '');
  }, [selectedOption]);

  const handleInputFocus = () => {
    openDropdown();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }

    setInputValue(event.target.value);
  };

  const handleSelectOption = (option: TSelectOption) => {
    setSelectedOption(option);
    setInputValue(option.value);
    setIsOpen(false);
    onChange?.(option);
  };

  const handleClear = () => {
    setSelectedOption(null);
    setInputValue('');
    setIsOpen(false);
    onChange?.(null);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleActionClick = () => {
    if (disabled) return;

    if (isOpen && inputValue) {
      setInputValue('');
      inputRef.current?.focus();
      return;
    }

    if (!isOpen && selectedOption) {
      handleClear();
      return;
    }

    if (isOpen) {
      closeDropdown();
      restoreSelectedValue();
      return;
    }

    openDropdown();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (!rootRef.current || !target) return;

      if (!rootRef.current.contains(target)) {
        closeDropdown();
        restoreSelectedValue();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown, restoreSelectedValue]);

  return (
    <SelectInputUI
      id={id}
      label={label}
      error={error}
      hint={hint}
      placeholder={placeholder}
      disabled={disabled}
      noOptionsText={noOptionsText}
      isOpen={isOpen}
      rootRef={rootRef}
      inputRef={inputRef}
      inputValue={inputValue}
      selectedOption={selectedOption}
      filteredOptions={filteredOptions}
      actionIconSrc={
        isOpen
          ? inputValue
            ? clearIconSrc
            : arrowUpIconSrc
          : selectedOption
            ? clearIconSrc
            : arrowDownIconSrc
      }
      actionAriaLabel={
        isOpen
          ? inputValue
            ? 'Очистить поиск'
            : 'Закрыть список'
          : selectedOption
            ? 'Очистить выбранное значение'
            : 'Открыть список'
      }
      handleInputChange={handleInputChange}
      handleInputFocus={handleInputFocus}
      handleActionClick={handleActionClick}
      handleSelectOption={handleSelectOption}
    />
  );
};
