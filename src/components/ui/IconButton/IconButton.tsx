import { FC } from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  iconSrc: string;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton: FC<IconButtonProps> = ({
  iconSrc,
  ariaLabel,
  onClick,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
    </button>
  );
};
