import React from 'react';
import styles from './Modal.module.scss';
import { Button } from '@/components/ui/ButtonUI';
import bellIcon from '@/assets/icons/bell.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  showBell?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText = 'Готово',
  onButtonClick,
  children,
  showBell = true,
}) => {
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {showBell && (
          <div className={styles.bellIcon}>
            <img src={bellIcon} alt="Уведомление" />
          </div>
        )}

        <div className={styles.contentBlock}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
          {children && !description && <div className={styles.content}>{children}</div>}

          <div className={styles.buttonWrapper}>
            <Button variant="primary" onClick={handleButtonClick}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
