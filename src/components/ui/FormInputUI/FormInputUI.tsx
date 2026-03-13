import React from 'react';
import styles from './FormInputUI.module.scss';
import { InputUI } from '../InputUI/InputUI';
import { IconButton } from '../IconButton';

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
  const iconSrc = isVisible ? '/src/assets/icons/eye-slach.svg' : '/src/assets/icons/eye.svg';

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
          iconSrc={iconSrc}
          ariaLabel="Показать или скрыть значение"
        />
      )}
    </div>
  );
};
