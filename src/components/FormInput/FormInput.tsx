import React, { useState } from 'react';
import { InputBaseContainerUI } from '../ui/InputBaseContainerUI';
import { FormInputUI } from '../ui/FormInputUI/FormInputUI';

export interface FormInputProps {
  type: string;
  placeholder: string;
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  id,
  label,
  error,
  hint,
}) => {
  const [value, setValue] = useState('');
  const [isValueVisible, setIsValueVisible] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleToggleValueVisibility = () => {
    setIsValueVisible((prev) => !prev);
  };

  const inputType = type === 'password' ? (isValueVisible ? 'text' : 'password') : type;

  return (
    <InputBaseContainerUI id={id} label={label} error={error} hint={hint}>
      <FormInputUI
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onShow={handleToggleValueVisibility}
        isVisible={isValueVisible}
        isPassword={type === 'password'}
        id={id}
      />
    </InputBaseContainerUI>
  );
};
