import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { selectUser } from '@/services/selectors';
import { selectIsAuthenticated } from '@/services/selectors';
import { logout } from '@/services/slices/authSlice';

import { SearchInput } from '@/components/SearchInput/SearchInput';
import { CategoryDropdown } from '@/components/CategoryDropdown';
import { Avatar, Button } from '@/components/ui';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo/Logo';

import styles from './Header.module.scss';

import CrossIcon from '@/assets/icons/cross.svg?react';
import LikeOutlineIcon from '@/assets/icons/like-outline.svg?react';
import MoonIcon from '@/assets/icons/moon.svg?react';
import NotificationIcon from '@/assets/icons/notification.svg?react';
import SunIcon from '@/assets/icons/sun.svg?react';
import LogoutIcon from '@/assets/icons/logout.svg?react';

const THEME_STORAGE_KEY = 'theme';
type Theme = 'light' | 'dark';

export interface HeaderProps {
  isAuthPage?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export const Header: FC<HeaderProps> = ({ isAuthPage = false, searchValue, onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [theme, setTheme] = useState<Theme>(() => {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === 'dark' || currentTheme === 'light') {
      return currentTheme;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
  });

  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClose = () => navigate(-1);
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleFavorites = () => navigate('/favorites');
  const handleProfile = () => navigate('/profile');
  const handleLogout = () => dispatch(logout());

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
            icon={isDarkTheme ? SunIcon : MoonIcon}
            ariaLabel="Смена темы"
            onClick={handleThemeToggle}
          />

          {isAuthenticated && (
            <>
              <IconButton icon={NotificationIcon} ariaLabel="Уведомления" className={styles.icon} />
              <IconButton
                icon={LikeOutlineIcon}
                ariaLabel="Избранное"
                className={styles.icon}
                onClick={handleFavorites}
              />
            </>
          )}
        </div>

        {isAuthenticated && user ? (
          <div
            className={styles.profileMenuWrapper}
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
          >
            <button type="button" className={styles.profileContainer}>
              <span className={styles.link}>{user.name ?? 'Профиль'}</span>
              <Avatar src={user.userAvatar} name={user.name} size="sm" />
            </button>

            {isProfileMenuOpen && (
              <div className={styles.profileDropdown}>
                <Button
                  variant="tertiary"
                  type="button"
                  className={styles.dropdownButton}
                  onClick={handleProfile}
                >
                  Личный кабинет
                </Button>
                <Button
                  variant="tertiary"
                  type="button"
                  className={styles.dropdownButton}
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                  <LogoutIcon />
                </Button>
              </div>
            )}
          </div>
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
