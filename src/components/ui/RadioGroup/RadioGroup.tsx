import React from 'react';
import { RadioButton } from '@/components/ui';
import styles from './RadioGroup.module.scss';

export interface RadioGroupProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange' | 'value' | 'name'
> {
  legend?: string;
  name: string;
  items: Array<{ label: string; value: string; disabled?: boolean }>;
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup = ({
  legend,
  name,
  items,
  value,
  onChange,
  className = '',
  ...rest
}: RadioGroupProps) => {
  return (
    <fieldset className={`${styles.fieldset} ${className}`} {...rest}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.value} className={styles.item}>
            <RadioButton
              label={item.label}
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={() => onChange(item.value)}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
