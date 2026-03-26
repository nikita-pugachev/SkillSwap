import { FC, MouseEvent as ReactMouseEvent, SVGProps } from 'react';
import styles from './IconButton.module.scss';

type IconComponent = FC<SVGProps<SVGSVGElement>>;

type IconButtonBaseProps = {
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isActive?: boolean;
  onMouseDown?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
};

type IconButtonWithComponent = IconButtonBaseProps & {
  icon: IconComponent;
  iconSrc?: never;
};

type IconButtonWithSource = IconButtonBaseProps & {
  icon?: never;
  iconSrc: string;
};

export type IconButtonProps = IconButtonWithComponent | IconButtonWithSource;

export const IconButton: FC<IconButtonProps> = (props) => {
  const {
    ariaLabel,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    isActive,
    onMouseDown,
  } = props;
  const Icon = 'icon' in props ? props.icon : null;
  const iconSrc = 'iconSrc' in props ? props.iconSrc : null;

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
      {Icon ? (
        <Icon className={styles.icon} aria-hidden="true" focusable="false" />
      ) : (
        <img src={iconSrc ?? ''} alt="" className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};
