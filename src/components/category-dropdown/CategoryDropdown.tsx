import React, { useState, useRef, useEffect } from 'react';
import styles from './CategoryDropdown.module.scss';
import { ChevronIcon } from '../ui/Icons/ChevronIcon';
import { getCategoriesColumns } from '../../data/categories';
import { CategoryRow } from './components/CategoryRow';

interface CategoryDropdownProps {
  onCategorySelect?: (value: string) => void;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  onCategorySelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    onCategorySelect?.(value);
    setIsOpen(false);
  };

  const { leftColumn, rightColumn } = getCategoriesColumns();

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.dropdownButton} ${className}`}
        onClick={handleToggle}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-haspopup="menu"
        aria-label="Все навыки"
      >
        <span>Все навыки</span>
        <ChevronIcon className={styles.chevron} isOpen={isOpen} />
      </button>

      {isOpen && (
        <div ref={menuRef} className={styles.menuPanel}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {/* Левая колонка */}
              <div className={styles.column}>
                {leftColumn.map((cat) => (
                  <CategoryRow key={cat.title} category={cat} onSelect={handleSelect} />
                ))}
              </div>

              {/* Правая колонка */}
              <div className={styles.column}>
                {rightColumn.map((cat) => (
                  <CategoryRow key={cat.title} category={cat} onSelect={handleSelect} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
