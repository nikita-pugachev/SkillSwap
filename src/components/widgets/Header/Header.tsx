import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { SearchInput } from '@/components/SearchInput/SearchInput';
import { CategoryDropdown } from '@/components/category-dropdown';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/ButtonUI/ButtonUI';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo/Logo';

import styles from './Header.module.scss';

import CrossIcon from '@/assets/icons/cross.svg?react';
import LikeOutlineIcon from '@/assets/icons/like-outline.svg';
import MoonIcon from '@/assets/icons/moon.svg';
import NotificationIcon from '@/assets/icons/notification.svg';
import SunIcon from '@/assets/icons/sun.svg';

export interface HeaderProps {
  isAuthPage?: boolean;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar: string;
  };
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export const Header: FC<HeaderProps> = ({
  isAuthPage = false,
  isAuthenticated = false,
  user,
  searchValue,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeToggle = () => setIsDarkTheme((prev) => !prev);
  const handleClose = () => navigate(-1);
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleFavorites = () => navigate('/favorites');
  const handleProfile = () => navigate('/profile');

  if (isAuthPage) {
    return (
      <header className={`${styles.header} ${styles.headerLogin}`}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <Button variant="tertiary" onClick={handleClose}>
            Закрыть
            <CrossIcon className={styles.icon} />
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
              <Link to="/about" className={styles.link}>
                О проекте
              </Link>
            </li>
            <li className={styles.navigationList}>
              <CategoryDropdown />
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.center}>
        <SearchInput className={styles.searchInput} value={searchValue} onSearch={onSearch} />
      </div>

      <div className={styles.right}>
        <div className={styles.iconContainer}>
          <IconButton
            iconSrc={isDarkTheme ? SunIcon : MoonIcon}
            ariaLabel="Смена темы"
            onClick={handleThemeToggle}
          />

          {isAuthenticated && (
            <>
              <IconButton
                iconSrc={NotificationIcon}
                ariaLabel="Уведомления"
                className={styles.icon}
              />
              <IconButton
                iconSrc={LikeOutlineIcon}
                ariaLabel="Избранное"
                className={styles.icon}
                onClick={handleFavorites}
              />
            </>
          )}
        </div>

        {isAuthenticated ? (
          <button type="button" onClick={handleProfile} className={styles.profileContainer}>
            <span className={styles.link}>{user?.name ?? 'Профиль'}</span>
            {user && <Avatar src={user.avatar} name={user.name} size="sm" />}
          </button>
        ) : (
          <div className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleLogin}>
              Войти
            </Button>
            <Button onClick={handleRegister}>Зарегистрироваться</Button>
          </div>
        )}
      </div>
    </header>
  );
};
