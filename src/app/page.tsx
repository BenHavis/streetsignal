// app/page.tsx
import styles from './page.module.css';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <h2 className={styles.heading}>Empower your neighborhood</h2>
        <p className={styles.subtext}>
          Report potholes, broken lights, and other issues on a shared map — no account needed.
        </p>
        <Link href="/report" className={styles.button}>
          Report an Issue
        </Link>
      </div>
    </section>
  );
}
