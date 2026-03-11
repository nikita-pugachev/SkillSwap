import React, { FC, useState } from 'react';
import { SearchInputUI } from '../ui/SearchInputUI';

export const SearchInput: FC = () => {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClear = () => {
    setValue('');
  };

  return <SearchInputUI value={value} onChange={onChange} onClear={onClear} />;
};
