import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setToken, setStoredUser } from '@/utils/auth';
import {
  createMockToken,
  getNextRegisteredUserId,
  isEmailTaken,
  saveRegisteredUser,
  toAuthUser,
  type MockUser,
} from '@/utils/mock-users';
import { login } from '@/services/slices/authSlice';
import type { AppDispatch } from '@/services/store';

import authStyles from '@/assets/styles/auth.module.scss';
import styles from './register-page.module.scss';

import { Button, IconButton, InputBaseContainerUI, InputUI } from '@/components/ui';

import { SelectInput } from '@/components/SelectInput';
import { DateInput } from '@/components/DateInput';
import type { TSelectOption } from '@/utils/types';

import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import appleIcon from '@/assets/icons/logo/apple.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';
import UserInfo from '@/assets/illustrations/user-info.svg';
import avatarAddIcon from '@/assets/icons/avatar-add.svg';
import SchoolBoard from '@/assets/illustrations/school-board.svg';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';
import defaultAvatar from '@/assets/icons/user.svg';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const GENDER_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'Мужской' },
  { id: 2, name: 'Женский' },
];

const CITY_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Казань' },
];

const CATEGORY_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'IT и программирование' },
  { id: 2, name: 'Дизайн' },
  { id: 3, name: 'Языки' },
];

const registerSchema: yup.ObjectSchema<FormValues> = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Введите имя')
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(30, 'Имя должно содержать максимум 30 символов'),
    email: yup.string().trim().required('Введите email').email('Некорректный email'),
    password: yup
      .string()
      .required('Введите пароль')
      .min(6, 'Пароль должен содержать не менее 6 символов'),
    confirmPassword: yup
      .string()
      .required('Подтвердите пароль')
      .oneOf([yup.ref('password')], 'Пароли не совпадают'),
  })
  .required();

const getInputFieldProps = <T extends { ref: unknown }>(field: T): Omit<T, 'ref'> => {
  const { ref, ...rest } = field;
  void ref;

  return rest;
};

export default function RegisterPage() {
  const [step, setStep] = useState(() => {
    const savedStep = Number(localStorage.getItem('registerStep'));
    return [1, 2, 3].includes(savedStep) ? savedStep : 1;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    control,
    getValues,
    trigger,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    localStorage.setItem('registerStep', String(step));
  }, [step]);

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

    clearErrors('email');

    try {
      const emailTaken = await isEmailTaken(getValues('email'));

      if (emailTaken) {
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
    const isValid = await trigger('name');

    if (!isValid) {
      return;
    }

    handleNextStep();
  };

  const handleStepThreeSubmit = handleSubmit((values) => {
    const newUser: MockUser = {
      id: getNextRegisteredUserId(),
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      userAvatar: defaultAvatar,
    };

    saveRegisteredUser(newUser);

    const authUser = toAuthUser(newUser);

    setToken(createMockToken(newUser.id));
    setStoredUser(authUser);
    dispatch(login(authUser));

    localStorage.removeItem('registerStep');
    navigate('/', { replace: true });
  });

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
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleStepOneSubmit();
                }}
                noValidate
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Email" id="email" error={errors.email?.message}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => {
                        const inputField = getInputFieldProps(field);

                        return (
                          <InputUI
                            {...inputField}
                            id="email"
                            type="email"
                            placeholder="Введите email"
                            onChange={(event) => {
                              if (errors.email?.type === 'manual') {
                                clearErrors('email');
                              }

                              inputField.onChange(event);
                            }}
                          />
                        );
                      }}
                    />
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Пароль"
                    id="password"
                    error={errors.password?.message}
                    hint="Пароль должен содержать не менее 6 символов"
                  >
                    <div className={authStyles.passwordField}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => {
                          const inputField = getInputFieldProps(field);

                          return (
                            <InputUI
                              {...inputField}
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Придумайте надёжный пароль"
                              onChange={(event) => {
                                inputField.onChange(event);

                                if (getValues('confirmPassword')) {
                                  void trigger('confirmPassword');
                                }
                              }}
                            />
                          );
                        }}
                      />
                      <IconButton
                        type="button"
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
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => {
                        const inputField = getInputFieldProps(field);

                        return (
                          <InputUI
                            {...inputField}
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Повторите пароль"
                          />
                        );
                      }}
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
                <button type="button" className={styles.avatarButton} aria-label="Добавить фото">
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
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleStepTwoSubmit();
                }}
                noValidate
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Имя" id="name" error={errors.name?.message}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => {
                        const inputField = getInputFieldProps(field);

                        return (
                          <InputUI
                            {...inputField}
                            id="name"
                            type="text"
                            placeholder="Введите ваше имя"
                          />
                        );
                      }}
                    />
                  </InputBaseContainerUI>

                  <div className={styles.row}>
                    <div className={styles.rowItem}>
                      <DateInput
                        id="birthDate"
                        label="Дата рождения"
                        placeholder="дд.мм.гггг"
                        disabled={false}
                      />
                    </div>

                    <div className={styles.rowItem}>
                      <SelectInput
                        id="gender"
                        label="Пол"
                        placeholder="Не указан"
                        options={GENDER_OPTIONS}
                        isOpen={openSelectId === 'gender'}
                        onToggle={(next) => setOpenSelectId(next ? 'gender' : null)}
                      />
                    </div>
                  </div>

                  <SelectInput
                    id="city"
                    label="Город"
                    placeholder="Не указан"
                    options={CITY_OPTIONS}
                    isOpen={openSelectId === 'city'}
                    onToggle={(next) => setOpenSelectId(next ? 'city' : null)}
                  />

                  <SelectInput
                    id="learnCategory"
                    label="Категория навыка, которому хотите научиться"
                    placeholder="Выберите категорию"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'learnCategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'learnCategory' : null)}
                  />

                  <SelectInput
                    id="learnSubcategory"
                    label="Подкатегория навыка, которому хотите научиться"
                    placeholder="Выберите подкатегорию"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'learnSubcategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'learnSubcategory' : null)}
                  />
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
                onSubmit={handleStepThreeSubmit}
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

                  <SelectInput
                    id="skillCategory"
                    label="Категория навыка"
                    placeholder="Выберите категорию навыка"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'skillCategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'skillCategory' : null)}
                  />

                  <SelectInput
                    id="skillSubcategory"
                    label="Подкатегория навыка"
                    placeholder="Выберите подкатегорию навыка"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'skillSubcategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'skillSubcategory' : null)}
                  />

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
                    <button type="button" className={styles.uploadButton}>
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
