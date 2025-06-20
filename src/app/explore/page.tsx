'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './explore.module.css';
import 'leaflet/dist/leaflet.css';


const MapContainer = dynamic(
  () => import('react-leaflet').then((leaflet) => leaflet.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((leaflet) => leaflet.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((leaflet) => leaflet.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((leaflet) => leaflet.Popup),
  { ssr: false }
);


export default function ExplorePage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Explore Reported Issues</h1>
        <p>Browse all submissions on the map below.</p>
      </div>

      <div className={styles.mapWrapper}>
        {hydrated && (
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={13}
            scrollWheelZoom={true}
            className={styles.leafletMap}
            key={hydrated ? 'map-mounted' : 'map-init'}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[40.7128, -74.006]}>
              <Popup>This is a test marker.</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </section>
  );
}
