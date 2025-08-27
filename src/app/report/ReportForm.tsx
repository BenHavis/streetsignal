"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation'
import { createClient } from "../../../utils/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import styles from "./report.module.css";

// Load Map only on the client, outside the main bundle
const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder}>
      <div style={{
        height: "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #ccc",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
        color: "#666"
      }}>
        Loading map...
      </div>
    </div>
  ),
});

type Category =
  | "Road"
  | "Lighting"
  | "Safety"
  | "Sanitation"
  | "Accessibility"
  | "Other";
const CATEGORIES: Category[] = [
  "Road",
  "Lighting",
  "Safety",
  "Sanitation",
  "Accessibility",
  "Other",
];

async function uploadPhoto(file: File): Promise<string | null> {
  const supabase = createClient();
  
  // Generate unique folder name (this will be your photo ID)
  const photoId = uuidv4();
  
  // Get file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `photo.${fileExt}`;
  
  // Upload to reports-photo bucket with folder structure
  const { data, error } = await supabase.storage
    .from('report-photos')
    .upload(`${photoId}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Photo upload error:', error);
    return null;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('report-photos')
    .getPublicUrl(`${photoId}/${fileName}`);

  return publicUrl;
}

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Road");
  const [description, setDescription] = useState("");
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [location, setLocation] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter()


  const defaultCenter: [number, number] = [40.7128, -74.006];
  const mapCenter: [number, number] =
    userLatitude !== null && userLongitude !== null
      ? [userLatitude, userLongitude]
      : defaultCenter;

  const useMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Non-blocking permission check
    try {
      const perm = await navigator.permissions?.query?.({ name: "geolocation" });
      if (perm?.state === "denied") {
        alert("Location access is blocked. Enable it in browser settings and refresh.");
        return;
      }
    } catch {}

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLatitude(coords.latitude);
        setUserLongitude(coords.longitude);
        setLocation(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
      },
      (error) => {
        const msg =
          error.code === error.PERMISSION_DENIED
            ? "Location access was denied. Enable permissions and try again."
            : error.code === error.POSITION_UNAVAILABLE
            ? "Location unavailable. Check device location services."
            : error.code === error.TIMEOUT
            ? "Location request timed out. Please try again."
            : "Unable to get your location.";
        alert(msg);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  };

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoFile(e.target.files?.[0] ?? null);
  }

async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setIsSubmitting(true);

  // Validate required fields
  const isValid = title.trim() && userLatitude !== null && userLongitude !== null;
  if (!isValid) {
    alert("Please add a title and location.");
    setIsSubmitting(false);
    return;
  }

  let photoUrl: string | null = null;
  let validation: any = null;

  try {
    // Handle photo upload if file exists
    if (photoFile) {
      // Lazy-load photo validation
      const { analyzePhoto, validatePhoto, logPhotoAnalysis } =
        await import("../../../lib/photoValidator");
      const analysis = await analyzePhoto(photoFile);
      validation = validatePhoto(analysis);
      logPhotoAnalysis(analysis);

      // Log the entire validation object
      console.log('=== FULL VALIDATION OBJECT ===');
      console.log(validation);
      console.log('===============================');

      if (!validation.isValid) {
        alert(`Photo issue: ${validation.reasons.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      // Upload photo and get URL
      photoUrl = await uploadPhoto(photoFile);
      
      if (!photoUrl) {
        alert("Failed to upload photo. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    // Create the report with photo URL and validation results
    const supabase = createClient();

    const { data, error } = await supabase.rpc('create_report', {
      p_title: title.trim(),
      p_category: category,
      p_description: description.trim() || null,
      p_lat: userLatitude,
      p_lng: userLongitude,
      p_address: location,
      p_photo_url: photoUrl,
      p_is_verified: photoFile ? validation.shouldAutoApprove : true,
      p_is_spam: false
    });

    if (error) {
      console.error('Error creating report:', error);
      alert("Failed to submit report. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Success! Reset form
    setTitle("");
    setCategory("Road");
    setDescription("");
    setUserLatitude(null);
    setUserLongitude(null);
    setLocation("");
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

     // Success! Redirect to confirmation page
    console.log('Report created successfully, redirecting to confirmation:', data?.id);
    router.push(`/report/confirmation/${data?.id}`);

  } catch (error) {
    console.error('Submission error:', error);
    alert("An error occurred while submitting the report. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Report an Issue</h1>
          <p className={styles.subtitle}>
            Help improve your community by reporting infrastructure problems.
          </p>
        </header>

        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={onSubmit} aria-label="Infrastructure issue report form">
            {/* Basic Information */}
            <fieldset className={`${styles.fieldGroup} ${styles.basic}`}>
              <legend className={styles.groupTitle}>📝 Basic Information</legend>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">
                  Issue Title <span aria-label="required">*</span>
                </label>
                <input
                  className={styles.input}
                  id="title"
                  type="text"
                  placeholder="e.g., Large pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-describedby="title-hint"
                  disabled={isSubmitting}
                  required
                />
                <small id="title-hint" className={styles.hint}>
                  Provide a clear, brief description of the issue
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="category">
                  Category <span aria-label="required">*</span>
                </label>
                <select
                  className={styles.select}
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  aria-describedby="category-hint"
                  disabled={isSubmitting}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <small id="category-hint" className={styles.hint}>
                  Select the type of infrastructure issue
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">
                  Description (Optional)
                </label>
                <textarea
                  className={styles.textarea}
                  id="description"
                  placeholder="Provide additional details about the issue..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-describedby="description-hint"
                  disabled={isSubmitting}
                />
                <small id="description-hint" className={styles.hint}>
                  Add any additional context that might help local authorities understand the issue
                </small>
              </div>
            </fieldset>

            {/* Location */}
            <fieldset className={styles.fieldGroup}>
              <legend className={styles.groupTitle}>📍 Location</legend>

              <div className={styles.locationSection}>
                <button
                  type="button"
                  className={styles.locationButton}
                  onClick={useMyLocation}
                  disabled={isSubmitting}
                  aria-label="Get current location coordinates automatically"
                >
                  🎯 Use My Current Location
                </button>

                <div className={styles.coordinateInputs} role="group" aria-labelledby="coordinates-label">
                 <h4 id="coordinates-label" className={styles.srOnly}>
                    Geographic Coordinates</h4>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="latitude">
                      Latitude <span aria-label="required">*</span>
                    </label>
                    <input
                      className={styles.input}
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="42.3601"
                      value={userLatitude ?? ""}
                      onChange={(e) => setUserLatitude(e.target.value ? Number(e.target.value) : null)}
                      aria-describedby="latitude-hint"
                      disabled={isSubmitting}
                      required
                    />
                    <small id="latitude-hint" className={styles.hint}>
                      North-south position (e.g., 42.3601)
                    </small>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="longitude">
                      Longitude <span aria-label="required">*</span>
                    </label>
                    <input
                      className={styles.input}
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-71.0589"
                      value={userLongitude ?? ""}
                      onChange={(e) => setUserLongitude(e.target.value ? Number(e.target.value) : null)}
                      aria-describedby="longitude-hint"
                      disabled={isSubmitting}
                      required
                    />
                    <small id="longitude-hint" className={styles.hint}>
                      East-west position (e.g., -71.0589)
                    </small>
                  </div>
                </div>

                <div className={styles.mapPlaceholder} role="img" aria-label="Interactive map showing issue location">
                  <Suspense fallback={null}>
                    <DynamicMap
                      mapCenter={mapCenter}
                      userLatitude={userLatitude}
                      userLongitude={userLongitude}
                      location={location}
                      className={styles.leafletMap}
                    />
                  </Suspense>
                </div>
              </div>
            </fieldset>

            {/* Photo Upload */}
            <fieldset className={styles.fieldGroup}>
              <legend className={styles.groupTitle}>📸 Photo Evidence</legend>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="photo">
                  Upload Photo (Optional)
                </label>
                <input
                  className={styles.fileInput}
                  id="photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  aria-describedby="photo-hint"
                  disabled={isSubmitting}
                />
                <small id="photo-hint" className={styles.hint}>
                  Add a photo to help illustrate the issue. JPEG and PNG files only.
                </small>
                {photoFile && (
                  <div className={styles.photoPreview} role="img" aria-label="Photo preview">
                    <img
                      src={URL.createObjectURL(photoFile)}
                      alt={`Preview of uploaded photo: ${photoFile.name}`}
                    />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Submit */}
            <section className={styles.submitSection}>
              <button 
                type="submit" 
                className={styles.submitButton} 
                aria-describedby="submit-hint"
                disabled={isSubmitting}
              >
                {isSubmitting ? "🔄 Submitting..." : "🚀 Submit Report"}
              </button>
              <small id="submit-hint" className={styles.hint}>
  This is not an official report with city authorities. Your submission will appear on the community map for awareness.
              </small>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}