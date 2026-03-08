import React from 'react';

type ButtonProps = {
  variant?: 'outlined' | 'contained';
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Button({ variant = 'contained', onClick, children }: ButtonProps) {
  return (
    <button className={`button button--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
