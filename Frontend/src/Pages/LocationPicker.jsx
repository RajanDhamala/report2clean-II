import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom component to track map click and set marker
function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationSelector() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">📍 Select a Location</h2>

      <MapContainer
        center={[26.5049, 87.2903]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%' }}
        className="rounded-lg border shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <LocationPicker
          onSelect={(coords) => {
            setSelectedLocation(coords);
          }}
        />
      </MapContainer>

      {selectedLocation && (
        <div className="mt-4 text-center text-gray-700">
          Selected Coordinates:
          <div className="font-medium">
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
