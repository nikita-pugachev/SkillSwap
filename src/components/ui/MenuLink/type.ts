import type { NavLinkProps } from 'react-router-dom';

export type MenuLinkProps = {
  href: string;
  label: string;
  className?: string;
} & Omit<NavLinkProps, 'to' | 'className' | 'children'>;
