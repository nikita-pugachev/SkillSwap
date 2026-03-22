import type { FC, SVGProps } from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton: FC<IconButtonProps> = ({
  icon: Icon,
  ariaLabel,
  onClick,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={styles.icon} aria-hidden="true" focusable="false" />
    </button>
  );
};
