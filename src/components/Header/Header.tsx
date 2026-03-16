import { FC } from 'react';
import { Logo } from '../ui/Logo/Logo';
import { SearchInput } from '../SearchInput/SearchInput';
import { Button } from '../ui/ButtonUI/ButtonUI';
import { Avatar } from '../ui';
import { CategoryDropdown } from '../category-dropdown';
import { IconButton } from '../ui/IconButton';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

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

  const handleClickLogin = () => navigate('/login');
  const handleClickRegister = () => navigate('/register');
  const handleClickProfile = () => navigate('/profile');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <header className={styles.header}>
        <div className={styles.left}>
          <Logo />
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
            <li className={styles.navigation_list}>
              <a className={styles.link}>О проекте</a>
            </li>
            <li className={styles.navigation_list}>
              <CategoryDropdown />
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.center}>
        <SearchInput className={styles.search_input} />
      </div>

      <div className={styles.right}>
        {isLogin ? (
          <div className={styles.icon_container}>
            <IconButton
              iconSrc="src/assets/icons/moon.svg"
              ariaLabel="Смена темы"
              className={styles.icon}
            />
            <IconButton
              iconSrc="src/assets/icons/notification.svg"
              ariaLabel="Уведомления"
              className={styles.icon}
            />
            <IconButton
              iconSrc="src/assets/icons/like-outline.svg"
              ariaLabel="Избранное"
              className={styles.icon}
            />
          </div>
        ) : (
          <div className={styles.icon_container}>
            <IconButton
              iconSrc="src/assets/icons/moon.svg"
              ariaLabel="Смена темы"
              className={styles.icon}
            />
          </div>
        )}

        {isLogin && user ? (
          <div onClick={handleClickProfile} className={styles.profile_container}>
            <a className={styles.link}>{user.name}</a>
            <Avatar src={user.avatar} name={user.name} size="sm" />
          </div>
        ) : (
          <div className={styles.button_container}>
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
