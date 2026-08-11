import type { FC } from 'react';
import { Logo, MenuLink } from '@/components/ui';
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
          <MenuLink label="О проекте" href="/about" />
        </li>
        <li>
          <MenuLink label="Все навыки" href="/all-skills" />
        </li>
      </ul>

      <ul className={styles.linkList}>
        <li>
          <MenuLink label="Контакты" href="/contact-information" />
        </li>
        <li>
          <MenuLink label="Блог" href="/blog" />
        </li>
      </ul>

      <ul className={styles.linkList}>
        <li>
          <MenuLink label="Политика конфиденциальности" href="/privacy-policy" />
        </li>
        <li>
          <MenuLink label="Пользовательское соглашение" href="/terms-of-service" />
        </li>
      </ul>
    </div>
  </footer>
);
