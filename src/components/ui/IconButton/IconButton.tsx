import { FC, MouseEvent as ReactMouseEvent, SVGProps } from 'react';
import styles from './IconButton.module.scss';

export interface IconButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isActive?: boolean;
  onMouseDown?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: FC<IconButtonProps> = ({
  icon: Icon,
  ariaLabel,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  isActive,
  onMouseDown,
}) => {
  return (
    <button
      type={type}
      className={[styles.iconButton, isActive ? styles.isActive : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      disabled={disabled}
      onMouseDown={onMouseDown}
    >
      <Icon className={styles.icon} aria-hidden="true" focusable="false" />
    </button>
  );
};
