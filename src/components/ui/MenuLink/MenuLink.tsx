import { NavLink } from 'react-router-dom';
import type { MenuLinkProps } from './type';
import styles from './MenuLink.module.scss';

export const MenuLink = ({ href, label, className, ...rest }: MenuLinkProps) => {
  return (
    <NavLink
      to={href}
      className={className ? `${styles.link} ${className}` : styles.link}
      {...rest}
    >
      {label}
    </NavLink>
  );
};
