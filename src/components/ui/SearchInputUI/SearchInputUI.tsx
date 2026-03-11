import React from 'react';
import styles from './SearchInputUI.module.scss';
import SearchIcon from '../../../assets/icons/search.svg?react';
import CloseIcon from '../../../assets/icons/cross.svg?react';

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
    <div className={styles.searchInput} id="search-input">
      <SearchIcon className={styles.searchInput__icon} aria-hidden="true" />

      <input
        type="search"
        aria-label={placeholder}
        className={styles.searchInput__field}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />

      {hasValue && (
        <button
          type="button"
          className={styles.searchInput__clear}
          onClick={onClear}
          aria-label="Очистить"
        >
          <CloseIcon className={styles.searchInput__clearIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
