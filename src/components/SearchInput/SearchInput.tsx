import React, { FC, useState } from 'react';
import { SearchInputUI } from '../ui/SearchInputUI';
import { InputBaseContainerUI } from '../ui/InputBaseContainerUI';

interface SearchInputProp {
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchInput: FC<SearchInputProp> = ({ onSearch, className }) => {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClear = () => {
    setValue('');
  };

  return (
    <InputBaseContainerUI isSearch={true} className={className}>
      <SearchInputUI value={value} onChange={onChange} onClear={onClear} onSearch={onSearch} />
    </InputBaseContainerUI>
  );
};
