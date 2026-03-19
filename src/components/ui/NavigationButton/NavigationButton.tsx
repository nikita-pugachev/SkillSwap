import { FC, ButtonHTMLAttributes } from 'react';
import styles from './NavigationButton.module.scss';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';

export interface NavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
}

export const NavigationButton: FC<NavigationButtonProps> = ({
  direction,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      aria-label={direction === 'left' ? 'Назад' : 'Вперед'}
      {...props}
    >
      <ChevronRight
        aria-hidden="true"
        className={direction === 'left' ? styles.leftIcon : undefined}
      />
    </button>
  );
};
