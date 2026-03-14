import styles from './login-page.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>SkillSwap</div>
        <div>Закрыть</div>
      </header>

      <h1 className={styles.title}>Вход</h1>

      <main className={styles.content}>
        <section className={styles.form}>form</section>

        <section className={styles.onboarding}>onboarding</section>
      </main>
    </div>
  );
}
