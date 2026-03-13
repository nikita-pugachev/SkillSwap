import React from 'react';
import styles from './ErrorPageUI.module.scss';

export type TErrorPageUIProps = {
  Illustration: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export const ErrorPageUI = ({ Illustration, title, description }: TErrorPageUIProps) => {
  return (
    <div className={styles.errorContainer}>
      <Illustration className={`${styles.errorIllustration} illustration-svg`} />
      <div className={styles.errorTextContainer}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};
