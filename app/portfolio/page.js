import styles from "./page.module.css";
import ProfileSection from "../components/Profile/ProfileSection";
import Terminal from "../components/Terminal/Terminal";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.profileSide}>
        <ProfileSection />
      </section>
      <section className={styles.terminalSide}>
        <Terminal />
      </section>
    </main>
  );
}
