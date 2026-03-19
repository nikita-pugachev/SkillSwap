import React from 'react';
import styles from './SearchInputUI.module.scss';
import SearchIcon from '../../../assets/icons/search.svg?react';
import { InputUI, IconButton } from '@/components/ui';

export interface SearchInputUIProps {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSearch?: (value: string) => void;
}

export const SearchInputUI: React.FC<SearchInputUIProps> = ({
  placeholder = 'Искать навык',
  value,
  onChange,
  onClear,
  onSearch,
}) => {
  const hasValue = value.length > 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <div className={[styles.searchInput].join(' ')} id="search-input">
      <SearchIcon className={styles.searchInput__icon} aria-hidden="true" />

      <InputUI
        type="search"
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />

      {hasValue && (
        <IconButton
          type="button"
          onClick={onClear}
          ariaLabel="Очистить"
          iconSrc="/src/assets/icons/cross.svg"
        />
      )}
    </div>
  );
};
