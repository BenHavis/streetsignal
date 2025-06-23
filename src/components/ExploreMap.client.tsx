'use client';

import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';
import styles from '@/app/explore/explore.module.css';

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setError('Permission denied')
    );
  }, []);

  const center = location ?? [40.7128, -74.006];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className={styles.leafletMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={center}>
          <Popup>{location ? 'Your location' : 'Default (NYC)'}</Popup>
        </Marker>
        {location && <RecenterOnLocation coords={center} />}
      </MapContainer>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
