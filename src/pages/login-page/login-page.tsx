import { useState } from 'react';
import { Link } from 'react-router-dom';

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // TODO: получать из состояния формы (Redux)
  const passwordError: string | undefined = undefined;

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
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
            <form
              className={authStyles.formContainer}
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: dispatch login action
              }}
            >
              <div className={authStyles.fields}>
                <InputBaseContainerUI label="Email" id="email">
                  <InputUI id="email" type="email" placeholder="Введите email" />
                </InputBaseContainerUI>

                <InputBaseContainerUI label="Пароль" id="password" error={passwordError}>
                  <div className={authStyles.passwordField}>
                    <InputUI
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите ваш пароль"
                    />

                    <IconButton
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
