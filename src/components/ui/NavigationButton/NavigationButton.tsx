import { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './NavigationButton.module.scss';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';

export interface NavigationButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  direction: 'left' | 'right';
}

export const NavigationButton = forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ direction, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const isLeft = direction === 'left';
    const computedAriaLabel = ariaLabel || (isLeft ? 'Назад' : 'Вперед');
    const buttonClass = [styles.button, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClass}
        aria-label={computedAriaLabel}
        {...props}
      >
        <ChevronRight aria-hidden="true" className={isLeft ? styles.leftIcon : undefined} />
      </button>
    );
  }
);
NavigationButton.displayName = 'NavigationButton';
