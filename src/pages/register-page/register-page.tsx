import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setStoredUser } from '@/utils/auth';
import { login } from '@/services/slices/authSlice';
import type { AppDispatch } from '@/services/store';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import authStyles from '@/assets/styles/auth.module.scss';
import styles from './register-page.module.scss';

import { Button } from '@/components/ui/ButtonUI';
import { IconButton } from '@/components/ui/IconButton';
import { InputBaseContainerUI } from '@/components/ui/InputBaseContainerUI';
import { InputUI } from '@/components/ui/InputUI';

import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import appleIcon from '@/assets/icons/logo/apple.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';
import UserInfo from '@/assets/illustrations/user-info.svg';
import avatarAddIcon from '@/assets/icons/avatar-add.svg';
import calendarIcon from '@/assets/icons/calendar.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import crossIcon from '@/assets/icons/cross.svg';
import SchoolBoard from '@/assets/illustrations/school-board.svg';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';
import defaultAvatar from '@/assets/icons/user.svg';

const schema = yup.object({
  name: yup
    .string()
    .required('Введите имя')
    .min(2, 'Минимум 2 символа')
    .max(30, 'Максимум 30 символов'),
  email: yup
    .string()
    .required('Введите email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный email'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(6, 'Пароль должен содержать не менее 6 знаков'),
  confirmPassword: yup
    .string()
    .required('Подтвердите пароль')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterUserFromJson = {
  id: number;
  name: string;
  email: string;
  password: string;
  userAvatar: string;
};

type RegisterUsersResponse = {
  users: RegisterUserFromJson[];
};

export default function RegisterPage() {
  const [step, setStep] = useState(() => {
    const savedStep = Number(localStorage.getItem('registerStep'));
    return [1, 2, 3].includes(savedStep) ? savedStep : 1;
  });

  useEffect(() => {
    localStorage.setItem('registerStep', String(step));
  }, [step]);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStepOneSubmit = async () => {
    const isValid = await trigger(['email', 'password', 'confirmPassword']);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch('/db/users.json');

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const usersData: RegisterUsersResponse = await response.json();
      const { email } = getValues();

      const rawRegisteredUsers = localStorage.getItem('registered_users');
      const registeredUsers: RegisterUserFromJson[] = rawRegisteredUsers
        ? JSON.parse(rawRegisteredUsers)
        : [];

      const allUsers = [...usersData.users, ...registeredUsers];

      const existingUser = allUsers.find((user) => user.email === email);

      if (existingUser) {
        setError('email', {
          type: 'manual',
          message: 'Пользователь с таким email уже существует',
        });
        return;
      }

      handleNextStep();
    } catch {
      setError('email', {
        type: 'manual',
        message: 'Не удалось проверить email. Попробуйте позже',
      });
    }
  };

  const handleStepTwoSubmit = async () => {
    const isValid = await trigger(['name']);

    // TODO: после подключения остальных полей шага 2 к форме добавить валидацию обязательных полей: trigger(['birthDate', 'gender', 'city', 'learnCategory', 'learnSubcategory'])

    if (!isValid) {
      return;
    }

    handleNextStep();
  };

  const handleStepThreeSubmit = async () => {
    const formValues = getValues();

    const newUser: RegisterUserFromJson = {
      id: Date.now(),
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      userAvatar: defaultAvatar,
    };

    saveRegisteredUser(newUser);

    const authUser = {
      id: newUser.id,
      name: newUser.name,
      userAvatar: newUser.userAvatar,
    };

    setToken(`mock-token-${newUser.id}`);
    setStoredUser(authUser);
    dispatch(login(authUser));

    localStorage.removeItem('registerStep');

    // TODO: после подключения полей шага 3 добавить валидацию обязательных полей: skillName, description, skillCategory, skillSubcategory, images.
    // TODO: по финальному сценарию после шага 3 сначала открывать модалку подтверждения, завершение регистрации и редирект выполнять только после подтверждения.
    navigate('/', { replace: true });
  };

  const saveRegisteredUser = (user: RegisterUserFromJson) => {
    const rawUsers = localStorage.getItem('registered_users');

    const registeredUsers: RegisterUserFromJson[] = rawUsers ? JSON.parse(rawUsers) : [];

    registeredUsers.push(user);

    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
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
    <main className={authStyles.main}>
      <div className={styles.steps}>
        <h1 className={authStyles.title}>Шаг {step} из 3</h1>
        <div className={styles.progressBar} aria-hidden="true">
          <span className={`${styles.segment} ${step >= 1 ? styles.segmentActive : ''}`} />
          <span className={`${styles.segment} ${step >= 2 ? styles.segmentActive : ''}`} />
          <span className={`${styles.segment} ${step >= 3 ? styles.segmentActive : ''}`} />
        </div>
      </div>

      <div className={authStyles.content}>
        {step === 1 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepOne}`}
              aria-label="Форма регистрации: шаг 1"
            >
              <div className={authStyles.socialButtons}>
                <Button variant="outlined" type="button">
                  <img src={googleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Google</span>
                </Button>

                <Button variant="outlined" type="button">
                  <img src={appleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Apple</span>
                </Button>
              </div>

              <div className={authStyles.divider}>или</div>

              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleStepOneSubmit();
                }}
                noValidate
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Email" id="email" error={errors.email?.message}>
                    <InputUI
                      id="email"
                      type="email"
                      placeholder="Введите email"
                      {...register('email')}
                    />
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Пароль"
                    id="password"
                    error={errors.password?.message}
                    hint="Пароль должен содержать не менее 6 знаков"
                  >
                    <div className={authStyles.passwordField}>
                      <InputUI
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Придумайте надёжный пароль"
                        {...register('password')}
                      />

                      <IconButton
                        iconSrc={showPassword ? eyeSlashIcon : eyeIcon}
                        ariaLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        onClick={togglePassword}
                      />
                    </div>
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Подтвердите пароль"
                    id="confirmPassword"
                    error={errors.confirmPassword?.message}
                  >
                    <InputUI
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Повторите пароль"
                      {...register('confirmPassword')}
                    />
                  </InputBaseContainerUI>
                </div>

                <Button variant="primary" type="submit" className={authStyles.submitButton}>
                  Далее
                </Button>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={lightBulb} alt="" className={authStyles.onboardingImage} />

              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Добро пожаловать в SkillSwap!</h2>

                <p className={authStyles.onboardingSubtitle}>
                  Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
                </p>
              </div>
            </section>
          </>
        )}

        {step === 2 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepTwo}`}
              aria-label="Форма регистрации: шаг 2"
            >
              <div className={styles.avatarBlock}>
                <button
                  type="button"
                  className={styles.avatarButton}
                  aria-label="Добавить фото"
                  // TODO: открыть загрузку фото профиля
                >
                  <img
                    src={avatarAddIcon}
                    alt=""
                    aria-hidden="true"
                    className={styles.avatarAddIcon}
                  />
                </button>
              </div>
              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleStepTwoSubmit();
                }}
                noValidate
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Имя" id="name" error={errors.name?.message}>
                    <InputUI
                      id="name"
                      type="text"
                      placeholder="Введите ваше имя"
                      {...register('name')}
                    />
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
                          <span className={styles.selectText}>дд.мм.гггг</span>

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
                          <span className={styles.selectText}>Не указан</span>

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
                      <span className={styles.selectText}>Не указан</span>

                      <img
                        src={openSelects.city ? crossIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Категория навыка, которому хотите научиться"
                    id="learnCategory"
                  >
                    <button
                      id="learnCategory"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('learnCategory')}
                      // TODO: открыть список категорий
                    >
                      <span className={styles.selectText}>Выберите категорию</span>

                      <img
                        src={openSelects.learnCategory ? chevronUpIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Подкатегория навыка, которому хотите научиться"
                    id="learnSubcategory"
                  >
                    <button
                      id="learnSubcategory"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('learnSubcategory')}
                      // TODO: открыть список подкатегорий
                    >
                      <span className={styles.selectText}>Выберите подкатегорию</span>

                      <img
                        src={openSelects.learnSubcategory ? chevronUpIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>
                </div>

                <div className={styles.actions}>
                  <Button type="button" variant="outlined" onClick={handlePrevStep}>
                    Назад
                  </Button>

                  <Button type="submit" variant="primary">
                    Продолжить
                  </Button>
                </div>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={UserInfo} alt="" className={authStyles.onboardingImage} />

              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Расскажите немного о себе</h2>

                <p className={authStyles.onboardingSubtitle}>
                  Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена
                </p>
              </div>
            </section>
          </>
        )}

        {step === 3 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepThree}`}
              aria-label="Форма регистрации: шаг 3"
            >
              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleStepThreeSubmit();
                }}
                noValidate
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Название навыка" id="skillName">
                    <InputUI
                      id="skillName"
                      type="text"
                      placeholder="Введите название вашего навыка"
                    />
                  </InputBaseContainerUI>

                  <InputBaseContainerUI label="Категория навыка" id="skillCategory">
                    <button
                      id="skillCategory"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('skillCategory')}
                      // TODO: открыть список категорий навыков
                    >
                      <span className={styles.selectText}>Выберите категорию навыка</span>

                      <img
                        src={openSelects.skillCategory ? chevronUpIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>

                  <InputBaseContainerUI label="Подкатегория навыка" id="skillSubcategory">
                    <button
                      id="skillSubcategory"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('skillSubcategory')}
                      // TODO: открыть список подкатегорий навыков
                    >
                      <span className={styles.selectText}>Выберите подкатегорию навыка</span>

                      <img
                        src={openSelects.skillSubcategory ? chevronUpIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>

                  <div className={styles.textareaBlock}>
                    <label htmlFor="description" className={styles.textareaLabel}>
                      Описание
                    </label>

                    <textarea
                      id="description"
                      className={styles.textarea}
                      placeholder="Коротко опишите, чему можете научить"
                    />
                  </div>

                  <div className={styles.uploadBlock}>
                    <p className={styles.uploadText}>Перетащите или выберите изображения навыка</p>

                    <button
                      type="button"
                      className={styles.uploadButton}
                      // TODO: открыть выбор изображений
                    >
                      <img
                        src={galleryAddIcon}
                        alt=""
                        aria-hidden="true"
                        className={styles.uploadIcon}
                      />
                      <span className={styles.uploadButtonText}>Выбрать изображения</span>
                    </button>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button type="button" variant="outlined" onClick={handlePrevStep}>
                    Назад
                  </Button>
                  <Button type="submit" variant="primary">
                    Продолжить
                  </Button>
                </div>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={SchoolBoard} alt="" className={authStyles.onboardingImage} />

              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Укажите, чем вы готовы поделиться</h2>

                <p className={authStyles.onboardingSubtitle}>
                  Так другие люди смогут увидеть ваши предложения и предложить вам обмен!
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
