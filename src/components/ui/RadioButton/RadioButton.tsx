import { forwardRef } from 'react';
import styles from './RadioButton.module.scss';

import RadioEmpty from '@/assets/icons/radiobutton-empty.svg?react';
import RadioActive from '@/assets/icons/radiobutton-active.svg?react';

export interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, name, value, checked, onChange, className = '', id, ...rest }, ref) => {
    const normalizeId = (str: string) => str.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    const inputId = id ?? normalizeId(`${name}-${value}`);

    const labelClassName = [styles.radio, className].filter(Boolean).join(' ');
    const iconClassName = [styles.icon, checked && styles.active].filter(Boolean).join(' ');

    return (
      <label htmlFor={inputId} className={labelClassName}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className={styles.input}
          {...rest}
        />
        <span className={iconClassName}>{checked ? <RadioActive /> : <RadioEmpty />}</span>
        <span className={styles.label}>{label}</span>
      </label>
    );
  }
);

RadioButton.displayName = 'RadioButton';
