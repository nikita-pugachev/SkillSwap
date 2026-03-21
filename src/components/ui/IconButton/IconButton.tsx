import { FC, MouseEvent as ReactMouseEvent } from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  iconSrc: string;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onMouseDown?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: FC<IconButtonProps> = ({
  iconSrc,
  ariaLabel,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  onMouseDown,
}) => {
  return (
    <button
      type={type}
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseDown={onMouseDown}
    >
      <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
    </button>
  );
};
