// app/report/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./report.module.css";
import {
  analyzePhoto,
  validatePhoto,
  logPhotoAnalysis,
} from "../../../lib/photoValidator";
import { supabase } from "../../../lib/supabase";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


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

export default function ReportPage() {
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Road");
  const [description, setDescription] = useState("");
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [location, setLocation] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultCenter: LatLngExpression = [40.7128, -74.006];

  useEffect(() => {
  // Fix Leaflet icons only on client side
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}, []);

  // Use user location if available, otherwise default
  const mapCenter: LatLngExpression =
    userLatitude !== null && userLongitude !== null
      ? [userLatitude, userLongitude]
      : defaultCenter;

  function RecenterOnLocation({ coords }: { coords: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
      map.setView(coords);
    }, [coords, map]);
    return null;
  }

  const useMyLocation = async () => {
    console.log("[useMyLocation] Called");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error(
        "[useMyLocation] Geolocation is not supported by this browser."
      );
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Check current permission status if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log(
          "[useMyLocation] Current permission status:",
          permission.state
        );

        if (permission.state === "denied") {
          console.log(
            "[useMyLocation] Permission is denied - showing instructions"
          );
          alert(
            "Location access is blocked. Please enable location permissions in your browser settings and refresh the page."
          );
          return;
        }
      } catch (permissionError) {
        console.log(
          "[useMyLocation] Permission API not fully supported, proceeding with location request"
        );
      }
    }

    console.log("[useMyLocation] Requesting position with 5 second timeout...");

    // Use shorter timeout to catch silent failures quickly
    const options = {
      enableHighAccuracy: false, // Try network-based location first (faster)
      timeout: 5000, // 5 seconds timeout
      maximumAge: 60000, // Accept cached position up to 1 minute old
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserLatitude(latitude);
        setUserLongitude(longitude);
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("[useMyLocation] Location access was denied");
            alert(
              "Location access was denied. Please enable location permissions in your browser and try again."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("[useMyLocation] Location information is unavailable");
            alert(
              "Location information is unavailable. Please check that location services are enabled on your device."
            );
            break;
          case error.TIMEOUT:
            console.log("[useMyLocation] Location request timed out");
            alert("Location request timed out. Please try again.");
            break;
          default:
            console.log("[useMyLocation] Unknown error occurred");
            alert(
              "Unable to get your location. Please check your browser's location permissions."
            );
            break;
        }
      },
      options
    );
  };

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Title:', title);
    console.log('Category:', category);
    console.log('Description:', description);
    console.log('Latitude:', userLatitude);
    console.log('Longitude:', userLongitude);
    console.log('Location:', location);
    
    // Photo analysis using helper
    if (photoFile) {
      const analysis = await analyzePhoto(photoFile);
      const validation = validatePhoto(analysis);
      
      logPhotoAnalysis(analysis);
      
      console.log('=== VALIDATION RESULT ===');
      console.log('Valid:', validation.isValid);
      console.log('Auto Approve:', validation.shouldAutoApprove);
      console.log('Needs Review:', validation.flaggedForReview);
      if (validation.reasons.length > 0) {
        console.log('Issues:', validation.reasons);
      }
      
      if (validation.shouldAutoApprove) {
        console.log('✅ Photo would be auto-approved');
      } else if (validation.flaggedForReview) {
        console.log('⚠️ Photo flagged for manual review');
      } else {
        console.log('❌ Photo rejected');
      }
    }
    
    const isValid = title.trim() && userLatitude !== null && userLongitude !== null;
    console.log('Form is valid:', isValid);
    console.log('=== END DEBUG ===');
    
    alert('Check console for detailed analysis!');
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
                <label className={styles.label} htmlFor="title">
                  Issue Title
                </label>
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
                <label className={styles.label} htmlFor="category">
                  Category
                </label>
                <select
                  className={styles.select}
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                />
              </div>
            </div>

            {/* Location */}
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>📍 Location</h3>

              <div className={styles.locationSection}>
                <button
                  type="button"
                  className={styles.locationButton}
                  onClick={useMyLocation}
                >
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
                      value={userLatitude ?? ""}
                      onChange={(e) =>
                        setUserLatitude(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
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
                      value={userLongitude ?? ""}
                      onChange={(e) =>
                        setUserLongitude(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className={styles.mapPlaceholder}>
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom
                    className={styles.leafletMap}
                    key={`${userLatitude}-${userLongitude}`}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        {location ? "Your location" : "Default (NYC)"}
                      </Popup>
                    </Marker>
                    {userLatitude !== null && userLongitude !== null && (
                      <RecenterOnLocation coords={mapCenter} />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>📸 Photo Evidence</h3>

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
                />
                {photoFile && (
                  <div className={styles.photoPreview}>
                    <img src={URL.createObjectURL(photoFile)} alt="Preview" />
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