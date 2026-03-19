import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>AI Resume Creator</h1>
        <p className={styles.subtitle}>
          Build an incredible professional resume effortlessly. Sign in, upload your achievements, and let AI do the rest.
        </p>
        <button className={styles.button}>
          Get Started with Google
        </button>
      </div>
    </main>
  );
}
