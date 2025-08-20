"use client";

import Link from "next/link";
import styles from "./confirmation.module.css";

export default function ReportConfirmation({
  params,
}: {
  params: { confirmationId: string };
}) {
  const displayId = `RPT-${params.confirmationId.split("-")[0].toUpperCase()}`;

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <header className={styles.headerCard} role="status" aria-live="polite">
          <div className={styles.iconWrap} aria-hidden="true">
            <span className={styles.successIcon}>✓</span>
          </div>

          <h1 className={styles.title}>Report received</h1>

          <div className={styles.referencePill} title="Reference number">
            <span className={styles.pillLabel}>Reference #: {displayId}</span>
          </div>

          <p className={styles.subtitle}>
            Your report has been recorded in this demo environment.
          </p>
        </header>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Important notice</h2>

          <div className={styles.disclaimerBox}>
            <div className={styles.warningBanner}>
              <strong>
                This is not an official municipal website and is not monitored
                by city officials.
              </strong>
            </div>

            <p className={styles.disclaimerText}>
              This system is for testing only. Reports are not forwarded to any
              agency or service department.
            </p>

            <div className={styles.realIssueSection}>
              <h3 className={styles.h3}>For real infrastructure issues</h3>
              <ul className={styles.contactList}>
                <li>Contact your city or county public works department</li>
                <li>Call 311 where available, for non-emergencies</li>
                <li>Use your municipal government’s official website</li>
                <li>Call 911 for emergencies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.actions}>
          <Link href="/report" className={`${styles.button} ${styles.primary}`}>
            Submit another test report
          </Link>

          <button
            type="button"
            className={`${styles.button} ${styles.ghost}`}
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </section>
      </main>
    </div>
  );
}
