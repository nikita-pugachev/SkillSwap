import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clearIconSrc from '../../assets/icons/cross.svg';
import { SelectInputUI } from '../ui/SelectInputUI';
import { TSelectOption } from '@/utils/types';

export type TSelectInputProps = {
  id: string;
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

const getFilteredOptions = (options: TSelectOption[], value: string) => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter((option) => option.name.toLowerCase().includes(normalized));
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
  const selectedOptionRef = useRef<TSelectOption | null>(null);

  const initialSelectedOption = useMemo(
    () => options.find((option) => option.name === defaultValue) ?? null,
    [options, defaultValue]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TSelectOption | null>(initialSelectedOption);
  const [inputValue, setInputValue] = useState(initialSelectedOption?.name ?? '');
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1);

  useEffect(() => {
    selectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSelectedOption(initialSelectedOption);
      setInputValue(initialSelectedOption?.name ?? '');
      setActiveOptionIndex(-1);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [initialSelectedOption]);

  const filteredOptions = useMemo(
    () => getFilteredOptions(options, inputValue),
    [options, inputValue]
  );

  const getInitialActiveIndex = useCallback(
    (list: TSelectOption[], option: TSelectOption | null) => {
      if (list.length === 0) {
        return -1;
      }

      if (!option) {
        return 0;
      }

      const selectedIndex = list.findIndex((item) => item.id === option.id);

      return selectedIndex >= 0 ? selectedIndex : 0;
    },
    []
  );

  const openDropdown = useCallback(() => {
    if (disabled) return;

    setIsOpen(true);
    setActiveOptionIndex(getInitialActiveIndex(filteredOptions, selectedOptionRef.current));
  }, [disabled, filteredOptions, getInitialActiveIndex]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveOptionIndex(-1);
  }, []);

  const restoreSelectedValue = useCallback((option?: TSelectOption | null) => {
    setInputValue(option?.name ?? '');
  }, []);

  const handleSelectOption = useCallback(
    (option: TSelectOption) => {
      setSelectedOption(option);
      setInputValue(option.name);
      setIsOpen(false);
      setActiveOptionIndex(-1);
      onChange?.(option);
    },
    [onChange]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const nextFilteredOptions = getFilteredOptions(options, nextValue);

    if (!isOpen) {
      setIsOpen(true);
    }

    setInputValue(nextValue);
    setSelectedOption(null);
    setActiveOptionIndex(nextFilteredOptions.length > 0 ? 0 : -1);
  };

  const handleClear = () => {
    setSelectedOption(null);
    setInputValue('');
    setIsOpen(false);
    setActiveOptionIndex(-1);
    onChange?.(null);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleActionClick = () => {
    if (disabled) return;

    if (isOpen && inputValue) {
      setInputValue('');
      setActiveOptionIndex(options.length > 0 ? 0 : -1);
      inputRef.current?.focus();
      return;
    }

    if (!isOpen && selectedOption) {
      handleClear();
      return;
    }

    if (isOpen) {
      closeDropdown();
      restoreSelectedValue(selectedOptionRef.current);
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
        restoreSelectedValue(selectedOptionRef.current);
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

      case 'Enter': {
        if (!isOpen) return;

        event.preventDefault();

        const option = filteredOptions[activeOptionIndex];

        if (option) {
          handleSelectOption(option);
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
        restoreSelectedValue(selectedOptionRef.current);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown, restoreSelectedValue]);

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
      activeOptionIndex={activeOptionIndex}
      clearIconSrc={clearIconSrc}
      shouldShowClear={shouldShowClear}
      actionAriaLabel={actionAriaLabel}
      handleInputChange={handleInputChange}
      handleInputFocus={openDropdown}
      handleInputKeyDown={handleKeyDown}
      handleActionClick={handleActionClick}
      handleSelectOption={handleSelectOption}
    />
  );
};
