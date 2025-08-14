// app/report/page.tsx
'use client';

import { useState, useRef } from 'react';

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
    <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1>Report an issue</h1>

      <form onSubmit={onSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Pothole on Elm Street"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category">Category</label>
          <select
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
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Large pothole in right lane near crosswalk"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Location inputs */}
        <div>
          <label>Location</label>

          <div>
            <button type="button" onClick={useMyLocation}>
              Use my location
            </button>
          </div>

          <div>
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={lat ?? ''}
              onChange={(e) => setLat(e.target.value ? Number(e.target.value) : null)}
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={lng ?? ''}
              onChange={(e) => setLng(e.target.value ? Number(e.target.value) : null)}
              required
            />
          </div>

          {/* Map picker placeholder */}
          <div style={{ height: 240, border: '1px dashed #ccc', marginTop: 8 }}>
            {/* TODO replace with a small map that sets lat,lng on click */}
            <p style={{ padding: 8 }}>Map picker goes here</p>
          </div>
        </div>

        {/* Photo */}
        <div>
          <label htmlFor="photo">Photo</label>
          <input
            id="photo"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {/* TODO optional preview */}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 16 }}>
          <button type="submit">Submit report</button>
        </div>
      </form>
    </main>
  );
}
