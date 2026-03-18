import React, { FC, useEffect, useState } from 'react';
import { SearchInputUI } from '../ui/SearchInputUI';
import { InputBaseContainerUI } from '../ui/InputBaseContainerUI';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProp {
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchInput: FC<SearchInputProp> = ({ onSearch, className }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClear = () => {
    setValue('');
  };

  return (
    <InputBaseContainerUI isSearch={true} className={className}>
      <SearchInputUI value={value} onChange={onChange} onClear={onClear} />
    </InputBaseContainerUI>
  );
};
