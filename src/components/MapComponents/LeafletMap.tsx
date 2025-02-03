import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mantine/core';
import { markerIcon } from './MapIcons';

const LeafletMap = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude] }  icon={markerIcon}></Marker>
    </MapContainer>
  );
};

export default LeafletMap;