import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { setToken, setStoredUser } from '@/utils/auth';

import type { AppDispatch } from '@/services/store';
import { login } from '@/services/slices/authSlice';

import authStyles from '@/assets/styles/auth.module.scss';
import styles from './login-page.module.scss';

import { Button } from '@/components/ui/ButtonUI';
import { IconButton } from '@/components/ui/IconButton';
import { InputBaseContainerUI } from '@/components/ui/InputBaseContainerUI';
import { InputUI } from '@/components/ui/InputUI';

import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import appleIcon from '@/assets/icons/logo/apple.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';

const schema = yup.object({
  email: yup
    .string()
    .required('Введите email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный email'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(6, 'Пароль должен содержать не менее 6 знаков'),
});

type FormValues = {
  email: string;
  password: string;
};

type AuthUserFromJson = {
  id: number;
  name: string;
  email: string;
  password: string;
  userAvatar: string;
};

type UsersResponse = {
  users: AuthUserFromJson[];
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FormValues) => {
    setAuthError('');

    try {
      const response = await fetch('/db/users.json');

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const usersData: UsersResponse = await response.json();

      const rawRegisteredUsers = localStorage.getItem('registered_users');
      const registeredUsers: AuthUserFromJson[] = rawRegisteredUsers
        ? JSON.parse(rawRegisteredUsers)
        : [];

      const allUsers = [...usersData.users, ...registeredUsers];

      const user = allUsers.find(
        (item) => item.email === data.email && item.password === data.password
      );

      if (!user) {
        setAuthError('Неверный email или пароль');
        return;
      }

      const authUser = {
        id: user.id,
        name: user.name,
        userAvatar: user.userAvatar,
      };

      setToken(`mock-token-${user.id}`);
      setStoredUser(authUser);
      dispatch(login(authUser));
      navigate('/', { replace: true });
    } catch {
      setAuthError('Не удалось выполнить вход. Попробуйте позже');
    }
  };

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
            <form className={authStyles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={authStyles.fields}>
                <InputBaseContainerUI label="Email" id="email" error={errors.email?.message}>
                  <InputUI
                    id="email"
                    type="email"
                    placeholder="Введите email"
                    {...register('email', {
                      onChange: () => setAuthError(''),
                    })}
                  />
                </InputBaseContainerUI>

                <InputBaseContainerUI
                  label="Пароль"
                  id="password"
                  error={errors.password?.message || authError}
                >
                  <div className={authStyles.passwordField}>
                    <InputUI
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите ваш пароль"
                      {...register('password', {
                        onChange: () => setAuthError(''),
                      })}
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
