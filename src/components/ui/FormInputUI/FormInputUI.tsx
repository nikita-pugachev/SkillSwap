import React from 'react';
import styles from './FormInputUI.module.scss';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton';
import eyeIcon from '@/assets/icons/eye.svg?react';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg?react';

export interface FormInputUIProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShow: () => void;
  isVisible?: boolean;
  isPassword?: boolean;
  id?: string;
}

export const FormInputUI: React.FC<FormInputUIProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onShow,
  id,
  isVisible = false,
  isPassword = false,
}) => {
  const icon = isVisible ? eyeSlashIcon : eyeIcon;

  return (
    <div className={styles.formInput}>
      <InputUI
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={placeholder}
        id={id}
      />

      {isPassword && (
        <IconButton
          onClick={onShow}
          type="button"
          icon={icon}
          ariaLabel="Показать или скрыть значение"
        />
      )}
    </div>
  );
};
