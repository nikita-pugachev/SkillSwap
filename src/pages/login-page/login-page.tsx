import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useDispatch } from 'react-redux';
import { setToken, setStoredUser } from '@/utils/auth';
import { createMockToken, findUserByCredentials, toAuthUser } from '@/utils/mock-users';

import type { AppDispatch } from '@/services/store';
import { login } from '@/services/slices/authSlice';

import authStyles from '@/assets/styles/auth.module.scss';
import styles from './login-page.module.scss';

import { Button, IconButton, InputBaseContainerUI, InputUI } from '@/components/ui';

import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import appleIcon from '@/assets/icons/logo/apple.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';

import type { LocationState } from '@/types/location';

type FormValues = {
  email: string;
  password: string;
};

const loginSchema: yup.ObjectSchema<FormValues> = yup
  .object({
    email: yup.string().trim().required('Введите email').email('Некорректный email'),
    password: yup
      .string()
      .required('Введите пароль')
      .min(6, 'Пароль должен содержать не менее 6 символов'),
  })
  .required();

const getInputFieldProps = <T extends { ref: unknown }>(field: T): Omit<T, 'ref'> => {
  const { ref, ...rest } = field;
  void ref;

  return rest;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async ({ email, password }) => {
    clearErrors('root');

    try {
      const user = await findUserByCredentials(email, password);

      if (!user) {
        setError('root', {
          type: 'manual',
          message: 'Неверный email или пароль',
        });
        return;
      }

      const authUser = toAuthUser(user);

      setToken(createMockToken(user.id));
      setStoredUser(authUser);
      dispatch(login(authUser));

      const state = location.state as LocationState | null;
      const from = state?.from;

      if (from?.pathname && from.pathname !== '/login' && from.pathname !== '/') {
        const redirectTo = from.pathname + (from.search || '') + (from.hash || '');
        navigate(redirectTo, {
          replace: true,
          state: from.state,
        });
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'Не удалось выполнить вход. Попробуйте позже',
      });
    }
  });

  const authError = typeof errors.root?.message === 'string' ? errors.root.message : undefined;

  return (
    <main className={authStyles.main}>
      <h1 className={authStyles.title}>Вход</h1>

      <div className={authStyles.content}>
        <section
          className={`${authStyles.formSection} ${styles.formSectionLogin}`}
          aria-label="Форма входа"
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

          <div className={styles.authBlock}>
            <form className={authStyles.formContainer} onSubmit={onSubmit} noValidate>
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
                            clearErrors('root');
                            inputField.onChange(event);
                          }}
                        />
                      );
                    }}
                  />
                </InputBaseContainerUI>

                <InputBaseContainerUI label="Пароль" id="password" error={errors.password?.message}>
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
                            placeholder="Введите ваш пароль"
                            onChange={(event) => {
                              clearErrors('root');
                              inputField.onChange(event);
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
              </div>

              <Button variant="primary" type="submit" className={authStyles.submitButton}>
                Войти
              </Button>
            </form>

            {authError ? (
              <p className={styles.authError} role="alert">
                {authError}
              </p>
            ) : null}

            <Link to="/register" className={styles.registerLink}>
              Зарегистрироваться
            </Link>
          </div>
        </section>

        <section className={authStyles.onboarding} aria-label="О платформе">
          <img src={lightBulb} alt="" className={authStyles.onboardingImage} />

          <div className={authStyles.onboardingText}>
            <h2 className={authStyles.onboardingTitle}>С возвращением в SkillSwap!</h2>

            <p className={authStyles.onboardingSubtitle}>
              Обменивайтесь знаниями и навыками с другими людьми
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
