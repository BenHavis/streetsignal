// src/app/explore/page.tsx
import dynamic from 'next/dynamic';
import styles from './explore.module.css';

import ExploreMap from '@/components/exploremap';

// Dynamically import the client-only map

export default function ExplorePage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Explore Reported Issues</h1>
        <p>Browse all submissions on the map below.</p>
      </div>
      <ExploreMap />
    </section>
  );
}
