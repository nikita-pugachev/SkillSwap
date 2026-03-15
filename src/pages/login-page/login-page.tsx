import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './login-page.module.scss';
import logo from '@/assets/icons/logo/logo.png';
import cross from '@/assets/icons/cross.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import appleIcon from '@/assets/icons/logo/apple.svg';
import { Button } from '@/components/ui/ButtonUI';
import { InputUI } from '@/components/ui/InputUI';
import { InputBaseContainerUI } from '@/components/ui/InputBaseContainerUI';
import { IconButton } from '@/components/ui/IconButton';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // TODO: получать из состояния формы (Redux)
  const passwordError: string | undefined = undefined;
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="SkillSwap" className={styles.logoIcon} />
          <span className={styles.logoText}>SkillSwap</span>
        </div>

        <button className={styles.closeButton} type="button">
          <span className={styles.closeText}>Закрыть</span>
          <img src={cross} alt="" className={styles.closeIcon} aria-hidden="true" />
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Вход</h1>
        <div className={styles.content}>
          <section className={styles.form} aria-label="Форма входа">
            <div className={styles.formContent}>
              <div className={styles.socialButtons}>
                <Button variant="outlined">
                  <img src={googleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Google</span>
                </Button>

                <Button variant="outlined">
                  <img src={appleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Apple</span>
                </Button>
              </div>
              <div className={styles.divider}>или</div>
              <div className={styles.fields}>
                <InputBaseContainerUI label="Email" id="email">
                  <InputUI id="email" type="email" placeholder="Введите email" />
                </InputBaseContainerUI>

                <InputBaseContainerUI label="Пароль" id="password" error={passwordError}>
                  <div className={styles.passwordField}>
                    <InputUI
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите ваш пароль"
                    />

                    <IconButton
                      iconSrc={showPassword ? eyeIcon : eyeSlashIcon}
                      ariaLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      onClick={togglePassword}
                      className={styles.passwordToggle}
                    />
                  </div>
                </InputBaseContainerUI>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" className={styles.submitButton}>
                Войти
              </Button>

              <Link to="/register" className={styles.registerLink}>
                Зарегистрироваться
              </Link>
            </div>
          </section>
          <section className={styles.onboarding} aria-label="О платформе">
            <img src={lightBulb} alt="" className={styles.onboardingImage} />

            <div className={styles.onboardingText}>
              <h2 className={styles.onboardingTitle}>С возвращением в SkillSwap!</h2>

              <p className={styles.onboardingSubtitle}>
                Обменивайтесь знаниями и навыками с другими людьми
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
