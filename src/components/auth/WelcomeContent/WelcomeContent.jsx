import styles from "./WelcomeContent.module.css";

export default function WelcomeContent({ onLogin }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Добро пожаловать!</h2>
      <p className={styles.lead}>Зарегистрируйтесь или войдите, чтобы получить доступ ко всем возможностям.</p>
      <button className={styles.cta} onClick={onLogin}>
        Зарегистрироваться / Войти
      </button>
    </div>
  );
}