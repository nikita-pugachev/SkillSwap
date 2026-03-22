import React, { FC, useEffect, useRef, useState } from 'react';
import { SearchInputUI } from '../ui/SearchInputUI';
import { InputBaseContainerUI } from '../ui/InputBaseContainerUI';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProp {
  value?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchInput: FC<SearchInputProp> = ({ value = '', onSearch, className }) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 300);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onClear = () => {
    setInputValue('');
  };

  return (
    <InputBaseContainerUI isSearch={true} className={className}>
      <SearchInputUI value={inputValue} onChange={onChange} onClear={onClear} />
    </InputBaseContainerUI>
  );
};
