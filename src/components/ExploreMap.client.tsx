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
import { fetchReportsClient } from '../../utils/functions/clientFunctions';
import { ReportType } from '../../utils/interfaces/types';
import styles from '@/app/explore/explore.module.css';

import L from 'leaflet';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  
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
  const [reports, setReports] = useState<ReportType[]>([])

  const fetchData = async () => {
    const reportData = await fetchReportsClient()
    setReports(reportData)
    console.log(reportData)
  }

  useEffect(() => {
    fetchData()

  },[location])

 const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


    // Fix Leaflet icons only on client side
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);
  
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

          
{reports && reports.map((report) => (
  <Marker
    key={report.id}
    position={[report.latitude!, report.longitude!]}
    icon={redIcon}
  >
    <Popup className={styles.reportPopup}>
      <div className={styles.popupHeader}>
        <h3 className={styles.popupTitle}>{report.title}</h3>
        <span className={`${styles.badge} ${styles[`status_${report.status ?? "unknown"}`]}`}>
          {report.status ?? "unknown"}
        </span>
      </div>

      <div className={styles.popupRow}>
        <span className={styles.label}>Category</span>
        <span className={styles.value}>{report.category ?? "—"}</span>
      </div>

      <div className={styles.popupRow}>
        <span className={styles.label}>Priority</span>
        <span className={`${styles.badge} ${styles[`priority_${report.priority ?? "none"}`]}`}>
          {report.priority ?? "—"}
        </span>
      </div>

      <div className={styles.popupRow}>
        <span className={styles.label}>Created</span>
        <time className={styles.value} dateTime={report.created_at}>
          {formatDate(report.created_at)}
        </time>
      </div>
    </Popup>
  </Marker>
))}


        {location && <RecenterOnLocation coords={center} />}
        
      </MapContainer>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
