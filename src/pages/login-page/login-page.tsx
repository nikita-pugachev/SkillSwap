import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setToken, setStoredUser } from '@/utils/auth';

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

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (field: FieldName, value: string): string | undefined => {
  if (field === 'email') {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return 'Введите email';
    }

    if (!EMAIL_PATTERN.test(normalizedValue)) {
      return 'Некорректный email';
    }

    return undefined;
  }

  if (!value) {
    return 'Введите пароль';
  }

  if (value.length < 6) {
    return 'Пароль должен содержать не менее 6 знаков';
  }

  return undefined;
};

const validateForm = (values: FormValues): FormErrors => {
  const nextErrors: FormErrors = {};

  (Object.keys(values) as FieldName[]).forEach((field) => {
    const error = validateField(field, values[field]);

    if (error) {
      nextErrors[field] = error;
    }
  });

  return nextErrors;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setAuthError('');
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      const nextError = validateField(field, value);

      if (nextError) {
        next[field] = nextError;
      } else {
        delete next[field];
      }

      return next;
    });
  };

  const handleBlur = (field: FieldName) => (event: FocusEvent<HTMLInputElement>) => {
    const nextError = validateField(field, event.target.value);

    setErrors((prev) => {
      const next = { ...prev };

      if (nextError) {
        next[field] = nextError;
      } else {
        delete next[field];
      }

      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    const nextErrors = validateForm(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

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

      const normalizedEmail = formValues.email.trim().toLowerCase();

      const user = allUsers.find(
        (item) =>
          item.email.trim().toLowerCase() === normalizedEmail &&
          item.password === formValues.password
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
            <form className={authStyles.formContainer} onSubmit={onSubmit} noValidate>
              <div className={authStyles.fields}>
                <InputBaseContainerUI label="Email" id="email" error={errors.email}>
                  <InputUI
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Введите email"
                    value={formValues.email}
                    onChange={handleInputChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </InputBaseContainerUI>

                <InputBaseContainerUI
                  label="Пароль"
                  id="password"
                  error={errors.password || authError}
                >
                  <div className={authStyles.passwordField}>
                    <InputUI
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите ваш пароль"
                      value={formValues.password}
                      onChange={handleInputChange('password')}
                      onBlur={handleBlur('password')}
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
