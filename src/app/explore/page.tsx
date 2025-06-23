'use client'

import dynamic from 'next/dynamic';
import styles from './explore.module.css';

const ExploreMap = dynamic(() => import('@/components/ExploreMap.client'), {
  ssr: false,
});

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
