import React from 'react';
import styles from './SearchInputUI.module.scss';
import SearchIcon from '../../../assets/icons/search.svg?react';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton';

export interface SearchInputUIProps {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchInputUI: React.FC<SearchInputUIProps> = ({
  placeholder = 'Искать навык',
  value,
  onChange,
  onClear,
}) => {
  const hasValue = value.length > 0;

  return (
    <div className={[styles.searchInput].join(' ')} id="search-input">
      <SearchIcon className={styles.searchInput__icon} aria-hidden="true" />

      <InputUI
        type="search"
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
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
