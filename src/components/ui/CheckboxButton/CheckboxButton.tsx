import styles from './CheckboxButton.module.scss';

import CheckboxEmpty from '@/assets/icons/checkbox-empty.svg?react';
import CheckboxDone from '@/assets/icons/checkbox-done.svg?react';
import CheckboxRemove from '@/assets/icons/checkbox-remove.svg?react';

export type CheckboxButtonState = 'empty' | 'checked' | 'indeterminate';

interface CheckboxButtonProps {
  label: string;
  state?: CheckboxButtonState;
  onChange: () => void;
}

export const CheckboxButton = ({ label, state = 'empty', onChange }: CheckboxButtonProps) => {
  let Icon = CheckboxEmpty;

  if (state === 'checked') Icon = CheckboxDone;
  if (state === 'indeterminate') Icon = CheckboxRemove;

  const iconClassName = [styles.icon, state !== 'empty' ? styles.active : '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.checkbox}>
      <input type="checkbox" className={styles.input} onChange={onChange} />

      <span className={iconClassName}>
        <Icon />
      </span>

      <span className={styles.label}>{label}</span>
    </label>
  );
};
