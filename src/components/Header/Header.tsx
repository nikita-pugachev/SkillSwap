import { FC } from 'react';
import { Logo } from '../ui/Logo/Logo';
import { SearchInput } from '../SearchInput/SearchInput';
import { Button } from '../ui/ButtonUI/ButtonUI';
import { Avatar } from '../ui';
import { CategoryDropdown } from '../category-dropdown';
import { IconButton } from '../ui/IconButton';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

interface HeaderProps {
  isLogin: boolean;
}

export const Header: FC<HeaderProps> = ({ isLogin }) => {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate('/login');
  };

  const handleClickRegister = () => {
    navigate('/register');
  };

  const handleClickProfile = () => {
    navigate('/profile');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <div>
            <Logo />
          </div>
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
                iconSrc="src\assets\icons\moon.svg"
                ariaLabel="Смена темы"
                className={styles.icon}
              ></IconButton>
              <IconButton
                iconSrc="src\assets\icons\notification.svg"
                ariaLabel="Уведомления"
                className={styles.icon}
              ></IconButton>
              <IconButton
                iconSrc="src\assets\icons\like-outline.svg"
                ariaLabel="Избранное"
                className={styles.icon}
              ></IconButton>
            </div>
          ) : (
            <div className={styles.icon_container}>
              <IconButton
                iconSrc="src\assets\icons\moon.svg"
                ariaLabel="Смена темы"
                className={styles.icon}
              ></IconButton>
            </div>
          )}
          {isLogin ? (
            <div onClick={handleClickProfile} className={styles.profile_container}>
              <a className={styles.link}>Михаил</a>
              <Avatar src="src\assets\user-avatars\michael.png" name="Михаил" size="sm"></Avatar>
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
    </>
  );
};
