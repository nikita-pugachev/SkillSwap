import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clearIconSrc from '../../assets/icons/cross.svg';
import { SelectInputUI } from '../ui/SelectInputUI';

export type TSelectOption = {
  id: number;
  name: string;
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
    () => options.find((option) => option.name === defaultValue) ?? null,
    [options, defaultValue]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TSelectOption | null>(defaultSelectedOption);
  const [inputValue, setInputValue] = useState(defaultSelectedOption?.name ?? '');

  const filteredOptions = useMemo(() => {
    const normalized = inputValue.trim().toLowerCase();

    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.name.toLowerCase().includes(normalized));
  }, [inputValue, options]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const restoreSelectedValue = useCallback(() => {
    setInputValue(selectedOption?.name ?? '');
  }, [selectedOption]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }

    setInputValue(event.target.value);
  };

  const handleSelectOption = (option: TSelectOption) => {
    setSelectedOption(option);
    setInputValue(option.name);
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

  const shouldShowClear = (isOpen && inputValue.length > 0) || (!isOpen && !!selectedOption);
  const actionAriaLabel = shouldShowClear
    ? isOpen
      ? 'Очистить поиск'
      : 'Очистить выбранное значение'
    : isOpen
      ? 'Закрыть список'
      : 'Открыть список';

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
      clearIconSrc={clearIconSrc}
      shouldShowClear={shouldShowClear}
      actionAriaLabel={actionAriaLabel}
      handleInputChange={handleInputChange}
      handleInputFocus={openDropdown}
      handleActionClick={handleActionClick}
      handleSelectOption={handleSelectOption}
    />
  );
};
