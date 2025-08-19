'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapComponentProps {
  mapCenter: LatLngExpression;
  userLatitude: number | null;
  userLongitude: number | null;
  location: string;
  className?: string;
}

function RecenterOnLocation({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords);
  }, [coords, map]);
  return null;
}

export default function MapComponent({ 
  mapCenter, 
  userLatitude, 
  userLongitude, 
  location, 
  className 
}: MapComponentProps) {
  useEffect(() => {
    // Fix Leaflet icons only on client side
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom
      className={className}
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
  );
}