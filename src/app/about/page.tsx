"use client";

import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>About StreetSignal</h1>
          <p className={styles.subtitle}>
            A demonstration platform for reporting local infrastructure issues.
          </p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Purpose</h2>
          <p className={styles.text}>
            StreetSignal was created as a prototype to showcase how residents
            could log and track community issues like potholes, broken lights,
            or sanitation problems in a shared system. It is designed for
            demonstration and educational use only.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Disclaimer</h2>
          <div className={styles.disclaimerBox}>
            <p className={styles.text}>
              <strong>StreetSignal is not an official municipal website.</strong>{" "}
              Reports submitted here are not monitored by city staff and will
              not be forwarded to any government agency or service department.
            </p>
            <p className={styles.text}>
              We do not assume responsibility for submitted reports or their
              contents. If you have an actual issue requiring city attention,
              please use the proper channels below:
            </p>
            <ul className={styles.contactList}>
              <li>Call <strong>311</strong> (where available) for non-emergencies</li>
              <li>Use your city government’s official website</li>
              <li>Dial <strong>911</strong> in case of emergencies</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
