import { useRef, useState, useEffect } from 'react';
import styles from './ProfilePage.module.scss';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { Footer } from '@/components/Footer/Footer';
import { InputBaseContainerUI } from '@/components/ui/InputBaseContainerUI';
import { InputUI } from '@/components/ui/InputUI';
import { IconButton } from '@/components/ui/IconButton';

import IconMail from '@/assets/icons/request.svg?react';
import IconMessage from '@/assets/icons/message-text.svg?react';
import IconLike from '@/assets/icons/like-outline.svg?react';
import IconIdea from '@/assets/icons/idea.svg?react';
import IconUser from '@/assets/icons/user.svg?react';
import IconEdit from '@/assets/icons/edit.svg?react';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import eyeIcon from '@/assets/icons/eye.svg';
import calendarIcon from '@/assets/icons/calendar.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import crossIcon from '@/assets/icons/cross.svg';
import IconGalleryEdit from '@/assets/icons/gallery-edit.svg?react';

export default function ProfilePage() {
  const [email, setEmail] = useState('#TODO почта пользователя');
  const emailRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);

  const [password, setPassword] = useState('#TODO пароль пользователя');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('Пользователь');
  const nameRef = useRef<HTMLInputElement>(null);

  const [about, setAbout] = useState('#TODO о пользователе');
  const aboutRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      passwordRef.current?.classList.remove(styles.passwordContainerState);
    } else {
      passwordRef.current?.classList.add(styles.passwordContainerState);
    }
  }, [isOpen]);

  const handleEditEmail = () => {
    setEmail('');
    emailRef.current?.focus();
  };

  const handleEditName = () => {
    setName('');
    nameRef.current?.focus();
  };

  const handleEditAbout = () => {
    setAbout('');
    aboutRef.current?.focus();
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [openSelects, setOpenSelects] = useState({
    gender: false,
    city: false,
    learnCategory: false,
    learnSubcategory: false,
    skillCategory: false,
    skillSubcategory: false,
  });

  const toggleSelect = (selectName: keyof typeof openSelects) => {
    setOpenSelects((prev) => ({
      ...prev,
      [selectName]: !prev[selectName],
    }));
  };

  return (
    <>
      <main className={styles.main}>
        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary">
                <IconMail />
                Заявки
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary">
                <IconMessage />
                Мои обмены
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary">
                <IconLike />
                Избранное
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary">
                <IconIdea />
                Избранное
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="primary">
                <IconUser />
                Личные данные
              </Button>
            </li>
          </ul>
        </nav>
        <div className={styles.profileInfo}>
          <div>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <InputBaseContainerUI className={styles.field} label="Почта" id="email">
                <div className={styles.inputEdit}>
                  <InputUI
                    id="email"
                    type="email"
                    value={email}
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <IconEdit onClick={handleEditEmail} />
                </div>
              </InputBaseContainerUI>
              <div>
                <p className={styles.editPassword} onClick={() => setOpen(!isOpen)}>
                  Изменить пароль
                </p>
              </div>
              <div ref={passwordRef} className={styles.passwordContainerState}>
                <InputBaseContainerUI label="Пароль" id="password">
                  <div className={styles.inputEdit}>
                    <InputUI
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <IconButton
                      iconSrc={showPassword ? eyeSlashIcon : eyeIcon}
                      ariaLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      onClick={togglePassword}
                    />
                  </div>
                </InputBaseContainerUI>
              </div>
              <InputBaseContainerUI label="Имя" id="name">
                <div className={styles.inputEdit}>
                  <InputUI
                    id="name"
                    type="text"
                    value={name}
                    ref={nameRef}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <IconEdit onClick={handleEditName} />
                </div>
              </InputBaseContainerUI>
              <div className={styles.row}>
                <div className={styles.rowItem}>
                  <InputBaseContainerUI label="Дата рождения" id="birthDate">
                    <button
                      id="birthDate"
                      type="button"
                      className={styles.selectField}
                      // TODO: открыть календарь
                    >
                      <span
                        className={styles.selectText} //TODO Дата рождения
                      >
                        20.03.2026
                      </span>

                      <img src={calendarIcon} alt="" aria-hidden="true" />
                    </button>
                  </InputBaseContainerUI>
                </div>

                <div className={styles.rowItem}>
                  <InputBaseContainerUI label="Пол" id="gender">
                    <button
                      id="gender"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('gender')}
                    >
                      <span
                        className={styles.selectText} //TODO Пол
                      >
                        Мужской
                      </span>

                      <img
                        src={openSelects.gender ? chevronUpIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>
                </div>
              </div>
              <InputBaseContainerUI label="Город" id="city">
                <button
                  id="city"
                  type="button"
                  className={styles.selectField}
                  onClick={() => toggleSelect('city')}
                  // TODO: открыть поиск и список городов
                >
                  <span
                    className={styles.selectText} //TODO Город
                  >
                    Москва
                  </span>

                  <img
                    src={openSelects.city ? crossIcon : chevronDownIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </InputBaseContainerUI>
              <div>
                <label htmlFor="about" className={styles.textareaLabel}>
                  О себе
                </label>
                <div className={styles.textareaWrapper}>
                  <textarea
                    id="about"
                    className={styles.textarea}
                    placeholder="Расскажите о себе"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    ref={aboutRef}
                  />
                  <button
                    type="button"
                    className={styles.textareaEditButton}
                    aria-label="Редактировать поле О себе"
                    onClick={handleEditAbout}
                  >
                    <IconEdit className={styles.textareaEditIcon} />
                  </button>
                </div>
              </div>
              <Button variant="primary">Сохранить</Button>
            </form>
          </div>
          <div className={styles.avatarWrapper}>
            <Avatar name={name} size="lg" />
            <div className={styles.avatarEdit}>
              <IconGalleryEdit />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
