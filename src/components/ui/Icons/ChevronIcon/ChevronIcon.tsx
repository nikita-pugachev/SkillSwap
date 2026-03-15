import React from 'react';
import styles from './ChevronIcon.module.scss';

interface ChevronIconProps {
  isOpen?: boolean;
  className?: string;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen, className = '' }) => {
  return (
    <svg
      className={`
        ${styles.chevron} 
        ${isOpen ? styles.chevronOpen : ''} 
        ${className}
      `}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 15.935a2.52 2.52 0 0 1-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018a2.51 2.51 0 0 1-1.781.738"
      />
    </svg>
  );
};
