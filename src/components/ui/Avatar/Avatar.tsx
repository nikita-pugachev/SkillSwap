import { FC } from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  src?: string;
  name: string;
  size: 'sm' | 'md' | 'lg';
}

export const Avatar: FC<AvatarProps> = ({ src, name, size }) => {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return <img className={`${styles.avatar} ${styles[size]}`} src={src} alt={name} />;
  }

  return <div className={`${styles.avatar} ${styles[size]} ${styles.fallback}`}>{initial}</div>;
};
