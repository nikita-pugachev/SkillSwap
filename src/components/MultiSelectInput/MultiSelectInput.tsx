import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clearIconSrc from '../../assets/icons/cross.svg';
import { MultiSelectInputUI } from '../ui';
import type { TSubcategoryOption } from '@/utils/types';

export type TMultiSelectInputProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: TSubcategoryOption[];
  defaultValue?: TSubcategoryOption[];
  onChange?: (options: TSubcategoryOption[]) => void;
  disabled?: boolean;
  noOptionsText?: string;
};

const EMPTY_DEFAULT_VALUE: TSubcategoryOption[] = [];

const getFilteredOptions = (options: TSubcategoryOption[], value: string) => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter(
    (option) =>
      option.title.toLowerCase().includes(normalized) ||
      option.categoryTitle.toLowerCase().includes(normalized)
  );
};

export const MultiSelectInput: React.FC<TMultiSelectInputProps> = ({
  id,
  label,
  error,
  hint,
  placeholder = 'Выберите подкатегории',
  options,
  defaultValue,
  onChange,
  disabled = false,
  noOptionsText = 'Ничего не найдено',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<TSubcategoryOption[]>(
    defaultValue ?? EMPTY_DEFAULT_VALUE
  );
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1);

  const filteredOptions = useMemo(
    () => getFilteredOptions(options, searchValue),
    [options, searchValue]
  );

  const selectedIds = useMemo(
    () => new Set(selectedOptions.map((option) => option.id)),
    [selectedOptions]
  );

  const inputValue = useMemo(() => {
    if (isOpen) {
      return searchValue;
    }

    return selectedOptions.map((option) => option.title).join(', ');
  }, [isOpen, searchValue, selectedOptions]);

  const openDropdown = useCallback(() => {
    if (disabled) return;

    setIsOpen(true);
    setActiveOptionIndex(-1);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchValue('');
    setActiveOptionIndex(-1);
  }, []);

  const handleToggleOption = useCallback(
    (option: TSubcategoryOption) => {
      setSelectedOptions((prev) => {
        const isAlreadySelected = prev.some((item) => item.id === option.id);

        const next = isAlreadySelected
          ? prev.filter((item) => item.id !== option.id)
          : [...prev, option];

        onChange?.(next);
        return next;
      });

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [onChange]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isOpen) {
      setIsOpen(true);
    }

    setSearchValue(nextValue);
    setActiveOptionIndex(-1);
  };

  const handleClear = () => {
    setSelectedOptions([]);
    setSearchValue('');
    setActiveOptionIndex(-1);
    onChange?.([]);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleActionClick = () => {
    if (disabled) return;

    if (isOpen && searchValue) {
      setSearchValue('');
      setActiveOptionIndex(-1);
      inputRef.current?.focus();
      return;
    }

    if (!isOpen && selectedOptions.length > 0) {
      handleClear();
      return;
    }

    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Escape': {
        if (!isOpen) return;

        event.preventDefault();
        closeDropdown();
        break;
      }

      case 'ArrowDown': {
        event.preventDefault();

        if (!isOpen) {
          openDropdown();
          return;
        }

        if (filteredOptions.length === 0) return;

        setActiveOptionIndex((prevIndex) => {
          if (prevIndex < 0) return 0;
          return Math.min(prevIndex + 1, filteredOptions.length - 1);
        });

        break;
      }

      case 'ArrowUp': {
        event.preventDefault();

        if (!isOpen) {
          openDropdown();
          return;
        }

        if (filteredOptions.length === 0) return;

        setActiveOptionIndex((prevIndex) => {
          if (prevIndex < 0) return filteredOptions.length - 1;
          return Math.max(prevIndex - 1, 0);
        });

        break;
      }

      case 'Enter':
      case ' ': {
        if (!isOpen) return;

        const option = filteredOptions[activeOptionIndex];

        if (option) {
          event.preventDefault();
          handleToggleOption(option);
        }

        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (!rootRef.current || !target) return;

      if (!rootRef.current.contains(target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const shouldShowClear =
    (isOpen && searchValue.length > 0) || (!isOpen && selectedOptions.length > 0);

  const actionAriaLabel = shouldShowClear
    ? isOpen
      ? 'Очистить поиск'
      : 'Очистить выбранные значения'
    : isOpen
      ? 'Закрыть список'
      : 'Открыть список';

  return (
    <MultiSelectInputUI
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
      selectedOptions={selectedOptions}
      filteredOptions={filteredOptions}
      selectedIds={selectedIds}
      activeOptionIndex={activeOptionIndex}
      clearIconSrc={clearIconSrc}
      shouldShowClear={shouldShowClear}
      actionAriaLabel={actionAriaLabel}
      handleInputChange={handleInputChange}
      handleInputFocus={openDropdown}
      handleInputKeyDown={handleKeyDown}
      handleActionClick={handleActionClick}
      handleToggleOption={handleToggleOption}
    />
  );
};
