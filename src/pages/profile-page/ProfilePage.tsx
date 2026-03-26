import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.scss';

import { Footer } from '@/components/Footer/Footer';
import { DateInput } from '@/components/DateInput';
import { SelectInput } from '@/components/SelectInput/SelectInput';
import { Avatar, Button } from '@/components/ui';
import { IconButton } from '@/components/ui/IconButton';
import { InputBaseContainerUI } from '@/components/ui/InputBaseContainerUI';
import { InputUI } from '@/components/ui/InputUI';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { selectUser } from '@/services/selectors';
import { userEdit, type AuthUserGender } from '@/services/slices/authSlice';
import { findUserById, toAuthUser } from '@/utils/mock-users';
import type { TSelectOption } from '@/utils/types';

import IconEdit from '@/assets/icons/edit.svg?react';
import IconGalleryEdit from '@/assets/icons/gallery-edit.svg?react';
import IconIdea from '@/assets/icons/idea.svg?react';
import IconLike from '@/assets/icons/like-outline.svg?react';
import IconMail from '@/assets/icons/request.svg?react';
import IconMessage from '@/assets/icons/message-text.svg?react';
import IconUser from '@/assets/icons/user.svg?react';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [cities, setCities] = useState<TSelectOption[]>([]);
  const [genders, setGenders] = useState<TSelectOption[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const [about, setAbout] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<TSelectOption | null>(null);
  const [city, setCity] = useState<TSelectOption | null>(null);
  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const [avatarSrc, setAvatarSrc] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/db/cities.json');
        if (!response.ok) {
          throw new Error('Ошибка загрузки городов');
        }

        const data: TSelectOption[] = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGender = async () => {
      try {
        const response = await fetch('/db/gender.json');
        if (!response.ok) {
          throw new Error('Ошибка загрузки пола');
        }

        const data: TSelectOption[] = await response.json();
        setGenders(data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchCities();
    void fetchGender();
  }, []);

  useEffect(() => {
    const hydrateUserProfile = async () => {
      if (!user?.id || user.email) {
        return;
      }

      try {
        const fullUser = await findUserById(user.id);

        if (!fullUser) {
          return;
        }

        dispatch(userEdit(toAuthUser(fullUser)));
      } catch (error) {
        console.error(error);
      }
    };

    void hydrateUserProfile();
  }, [dispatch, user?.email, user?.id]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setEmail(user.email ?? '');
    setPassword(user.password ?? '');
    setName(user.name ?? '');
    setAbout(user.about ?? '');
    setBirthday(user.birthday ?? '');
    setAvatarSrc(user.userAvatar ?? '');
  }, [user]);

  useEffect(() => {
    if (cities.length === 0) {
      return;
    }

    if (user?.city) {
      setCity(cities.find((option) => option.name === user.city) ?? null);
      return;
    }

    if (user?.cityId) {
      setCity(cities.find((option) => option.id === user.cityId) ?? null);
      return;
    }

    setCity(null);
  }, [cities, user?.city, user?.cityId]);

  useEffect(() => {
    if (genders.length === 0) {
      return;
    }

    if (!user?.gender) {
      setGender(null);
      return;
    }

    setGender(genders.find((option) => option.name === user.gender) ?? null);
  }, [genders, user?.gender]);

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

  const handleFavorit = () => {
    navigate('/favorites');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(
      userEdit({
        email,
        password,
        name,
        about,
        birthday,
        gender: gender?.name as AuthUserGender | undefined,
        city: city?.name,
        cityId: city?.id,
        userAvatar: avatarSrc,
      })
    );
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
              <Button variant="tertiary" onClick={handleFavorit}>
                <IconLike />
                Избранное
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary">
                <IconIdea />
                Мои навыки
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
            <form className={styles.form} onSubmit={handleSubmit}>
              <InputBaseContainerUI className={styles.field} label="Почта" id="email">
                <div className={styles.inputEdit}>
                  <InputUI
                    id="email"
                    type="email"
                    value={email}
                    ref={emailRef}
                    placeholder="Введите ваш новый email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <IconEdit onClick={handleEditEmail} />
                </div>
              </InputBaseContainerUI>

              <div>
                <p className={styles.editPassword} onClick={() => setOpen(!isOpen)}>
                  Изменить пароль
                </p>
              </div>

              <div ref={passwordRef} className={!isOpen ? styles.passwordContainerState : ''}>
                <InputBaseContainerUI label="Пароль" id="password">
                  <div className={styles.inputEdit}>
                    <InputUI
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      placeholder="Введите ваш новый пароль"
                      onChange={(event) => setPassword(event.target.value)}
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
                    placeholder="Введите ваше имя"
                    onChange={(event) => setName(event.target.value)}
                  />
                  <IconEdit onClick={handleEditName} />
                </div>
              </InputBaseContainerUI>

              <div className={styles.row}>
                <div className={styles.rowItem}>
                  <DateInput
                    key={user?.birthday || 'empty-birthday'}
                    disabled={false}
                    id="birthDate"
                    label="Дата рождения"
                    placeholder="дд.мм.гггг"
                    defaultValue={birthday}
                    onChange={setBirthday}
                  />
                </div>

                <div className={styles.rowItem}>
                  <SelectInput
                    id="gender"
                    label="Пол"
                    options={genders}
                    defaultValue={gender?.name}
                    onChange={setGender}
                  />
                </div>
              </div>

              <SelectInput
                id="city"
                label="Город"
                options={cities}
                defaultValue={city?.name}
                onChange={setCity}
              />

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
                    onChange={(event) => setAbout(event.target.value)}
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

              <Button variant="primary" type="submit">
                Сохранить
              </Button>
            </form>
          </div>

          <div className={styles.avatarWrapper}>
            <Avatar src={avatarSrc || undefined} name={name} size="lg" />
            <button type="button" className={styles.avatarEdit} onClick={handleAvatarButtonClick}>
              <IconGalleryEdit />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              className={styles.avatarInput}
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
