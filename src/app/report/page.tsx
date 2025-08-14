// app/report/page.tsx
'use client';

import { useState, useRef } from 'react';
import styles from './report.module.css'
type Category = 'Road' | 'Lighting' | 'Safety' | 'Sanitation' | 'Accessibility' | 'Other';
const CATEGORIES: Category[] = ['Road', 'Lighting', 'Safety', 'Sanitation', 'Accessibility', 'Other'];

export default function ReportPage() {
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Road');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // TODO replace alerts with proper UI
  function useMyLocation() {
    // TODO request geolocation, set lat and lng
    // navigator.geolocation.getCurrentPosition(...)
    alert('TODO: Use my location');
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    // TODO handle file validation and preview if desired
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO validate inputs
    // TODO if using storage, upload photo first, get public URL
    // TODO POST to /api/reports with JSON or FormData
    alert('TODO: submit report');
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Report an issue</h1>

     <form className={styles.form} onSubmit={onSubmit}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Title</label>
          <input
            className={styles.input}
            id="title"
            type="text"
            placeholder="Pothole on Elm Street"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Category</label>
          <select
            className={styles.select}
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">Description</label>
          <textarea
            className={styles.textarea}
            id="description"
            placeholder="Large pothole in right lane near crosswalk"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Location inputs */}
        <div className={styles.field}>
          <label className={styles.label}>Location</label>

          <div className={styles.locationSection}>
            <button type="button" className={styles.locationButton} onClick={useMyLocation}>
              📍 Use my location
            </button>

            <div className={styles.coordinateInputs}>
              <input
                className={styles.input}
                type="number"
                step="any"
                placeholder="Latitude"
                value={lat ?? ''}
                onChange={(e) => setLat(e.target.value ? Number(e.target.value) : null)}
                required
              />
              <input
                className={styles.input}
                type="number"
                step="any"
                placeholder="Longitude"
                value={lng ?? ''}
                onChange={(e) => setLng(e.target.value ? Number(e.target.value) : null)}
                required
              />
            </div>

            <div className={styles.mapPlaceholder}>
              Map picker goes here
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="photo">Photo</label>
          <input
            className={styles.fileInput}
            id="photo"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>

        {/* Actions */}
        <div className={styles.submitSection}>
          <button type="submit" className={styles.submitButton}>
            Submit report
          </button>
        </div>
      </form>
    </main>
  );
}
