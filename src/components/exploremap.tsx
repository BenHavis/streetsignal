'use client';

import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import styles from '@/app/explore/explore.module.css';
import 'leaflet/dist/leaflet.css';

// Inline component to recenter the map view when coordinates change
function RecenterOnLocation({ coords }: { coords: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords);
  }, [coords, map]);
  return null;
}

export default function ExploreMap() {
  const [location, setLocation] = useState<LatLngTuple | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
      },
      () => {
        setError('Location access denied or unavailable.');
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const center: LatLngTuple = location ?? [40.7128, -74.006]; // Default: NYC

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.leafletMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={center}>
          <Popup>{location ? 'Your current location' : 'Default location (NYC)'}</Popup>
        </Marker>
        {location && <RecenterOnLocation coords={location} />}
      </MapContainer>

      {!location && (
        <div className={styles.locationNotice}>
          <p>
            We couldn’t access your location. Please retry or enable location access in your browser settings.
          </p>
          <button onClick={getLocation} className={styles.retryButton}>
            Retry Location Access
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      )}
    </div>
  );
}
