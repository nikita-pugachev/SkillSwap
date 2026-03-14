import { useState } from 'react';
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
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

      <h1 className={styles.title}>Вход</h1>

      <main className={styles.content}>
        {/* FORM */}
        <section className={styles.form}>
          <div className={styles.formContent}>
            {/* Social */}
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

            {/* Divider */}
            <div className={styles.divider}>или</div>

            {/* Input fields */}
            <div className={styles.fields}>
              <InputBaseContainerUI label="Email" id="email">
                <InputUI id="email" type="email" placeholder="Введите email" />
              </InputBaseContainerUI>

              <InputBaseContainerUI label="Пароль" id="password">
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

          {/* Actions */}
          <div className={styles.actions}>
            <Button variant="primary" className={styles.submitButton}>
              Войти
            </Button>

            <a href="/register" className={styles.registerLink}>
              Зарегистрироваться
            </a>
          </div>
        </section>

        {/* ONBORDING */}
        <section className={styles.onboarding}>onboarding</section>
      </main>
    </div>
  );
}
