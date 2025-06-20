import styles from './page.module.css';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <h2 className={styles.heading}>Empower Your Neighborhood</h2>
        <p className={styles.subtext}>
          StreetSignal helps you report and track local infrastructure issues like potholes, broken lights, graffiti, and more.
          Together, we can make our streets safer and more accountable — one pin at a time.
        </p>

        <div className={styles.actions}>
          <Link href="/report" className={styles.buttonPrimary}>
            Report an Issue
          </Link>
          <Link href="/explore" className={styles.buttonSecondary}>
            Explore Map
          </Link>
        </div>

        <div className={styles.features}>
          <div>
            <h3 className={styles.featureTitle}>📍 Drop a Pin</h3>
            <p>Click on the map to mark the exact location of the issue.</p>
          </div>
          <div>
            <h3 className={styles.featureTitle}>📸 Add a Photo</h3>
            <p>Upload an image so others know what to look for.</p>
          </div>
          <div>
            <h3 className={styles.featureTitle}>🗺 View Reports</h3>
            <p>See all community-submitted issues on a shared map.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
