import { FC, useState } from 'react';
import { Avatar, Logo, Button, IconButton } from '@/components/ui';
import { SearchInput } from '../SearchInput';
import { CategoryDropdown } from '../CategoryDropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

import CrossIcon from '@/assets/icons/cross.svg';
import MoonIcon from '@/assets/icons/moon.svg';
import NotificationIcon from '@/assets/icons/notification.svg';
import LikeOutlineIcon from '@/assets/icons/like-outline.svg';

const THEME_STORAGE_KEY = 'theme';
type Theme = 'light' | 'dark';

export interface HeaderProps {
  isLogin: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export const Header: FC<HeaderProps> = ({ isLogin, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    const currentTheme = document.documentElement.dataset.theme;
    if (currentTheme === 'dark' || currentTheme === 'light') {
      return currentTheme;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return 'light';
  });

  const handleClickLogin = () => navigate('/login');
  const handleClickRegister = () => navigate('/register');
  const handleClickProfile = () => navigate('/profile');
  const handleBackSpace = () => navigate(-1);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleToggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  if (isAuthPage) {
    return (
      <header className={`${styles.header} ${styles.headerLogin}`}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <Button variant="tertiary" onClick={handleBackSpace}>
            Закрыть
            <img src={CrossIcon} alt="" className={styles.icon} />
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        <nav>
          <ul className={styles.navigation}>
            <li className={styles.navigationList}>
              <a className={styles.link}>О проекте</a>
            </li>
            <li className={styles.navigationList}>
              <CategoryDropdown />
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.center}>
        <SearchInput className={styles.searchInput} />
      </div>

      <div className={styles.right}>
        {isLogin ? (
          <div className={styles.iconContainer}>
            <IconButton
              iconSrc={MoonIcon}
              ariaLabel="Смена темы"
              className={styles.icon}
              onClick={handleToggleTheme}
            />
            <IconButton
              iconSrc={NotificationIcon}
              ariaLabel="Уведомления"
              className={styles.icon}
            />
            <IconButton iconSrc={LikeOutlineIcon} ariaLabel="Избранное" className={styles.icon} />
          </div>
        ) : (
          <div className={styles.iconContainer}>
            <IconButton
              iconSrc={MoonIcon}
              ariaLabel="Смена темы"
              className={styles.icon}
              onClick={handleToggleTheme}
            />
          </div>
        )}

        {isLogin && user ? (
          <div onClick={handleClickProfile} className={styles.profileContainer}>
            <a className={styles.link}>{user.name}</a>
            <Avatar src={user.avatar} name={user.name} size="sm" />
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleClickLogin}>
              Войти
            </Button>
            <Button onClick={handleClickRegister}>Зарегистрироваться</Button>
          </div>
        )}
      </div>
    </header>
  );
};
