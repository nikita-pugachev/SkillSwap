import type { FC } from 'react';
import { Logo } from '@/components/ui/Logo';
import { MenuLink } from '@/components/ui/MenuLink/MenuLink';
import styles from './Footer.module.scss';

export const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.logoSection}>
      <Logo />
      <span className={styles.copyright}>SkillSwap - 2026</span>
    </div>

    <div className={styles.linkSection}>
      <ul className={`${styles.linkList} ${styles.styledLinkList}`}>
        <li>
          <MenuLink label="О проекте" href="#" />
        </li>
        <li>
          <MenuLink label="Все навыки" href="#" />
        </li>
      </ul>

      <ul className={styles.linkList}>
        <li>
          <MenuLink label="Контакты" href="#" />
        </li>
        <li>
          <MenuLink label="Блог" href="#" />
        </li>
      </ul>

      <ul className={styles.linkList}>
        <li>
          <MenuLink label="Политика конфиденциальности" href="#" />
        </li>
        <li>
          <MenuLink label="Пользовательское соглашение" href="#" />
        </li>
      </ul>
    </div>
  </footer>
);
