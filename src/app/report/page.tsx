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

  function useMyLocation() {
    // TODO request geolocation, set lat and lng
    alert('TODO: Use my location');
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('TODO: submit report');
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Report an Issue</h1>
          <p className={styles.subtitle}>
            Help improve your community by reporting infrastructure problems. 
            Your report will be visible to neighbors and local authorities.
          </p>
        </div>

        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={onSubmit}>
            
            {/* Basic Information */}
            <div className={`${styles.fieldGroup} ${styles.basic}`}>
              <h3 className={styles.groupTitle}>📝 Basic Information</h3>
              
              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">Issue Title</label>
                <input
                  className={styles.input}
                  id="title"
                  type="text"
                  placeholder="e.g., Large pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

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

              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">Description (Optional)</label>
                <textarea
                  className={styles.textarea}
                  id="description"
                  placeholder="Provide additional details about the issue..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>📍 Location</h3>
              
              <div className={styles.locationSection}>
                <button type="button" className={styles.locationButton} onClick={useMyLocation}>
                  🎯 Use My Current Location
                </button>

                <div className={styles.coordinateInputs}>
                  <div className={styles.field}>
                    <label className={styles.label}>Latitude</label>
                    <input
                      className={styles.input}
                      type="number"
                      step="any"
                      placeholder="42.3601"
                      value={lat ?? ''}
                      onChange={(e) => setLat(e.target.value ? Number(e.target.value) : null)}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Longitude</label>
                    <input
                      className={styles.input}
                      type="number"
                      step="any"
                      placeholder="-71.0589"
                      value={lng ?? ''}
                      onChange={(e) => setLng(e.target.value ? Number(e.target.value) : null)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.mapPlaceholder}>
                  🗺️ Interactive map coming soon - click to select location
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>📸 Photo Evidence</h3>
              
              <div className={styles.field}>
                <label className={styles.label} htmlFor="photo">Upload Photo (Optional)</label>
                <input
                  className={styles.fileInput}
                  id="photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
                {photoFile && (
                  <div className={styles.photoPreview}>
                    <img 
                      src={URL.createObjectURL(photoFile)} 
                      alt="Preview" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className={styles.submitSection}>
              <button type="submit" className={styles.submitButton}>
                🚀 Submit Report
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}