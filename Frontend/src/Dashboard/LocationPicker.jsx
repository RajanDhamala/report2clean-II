import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// LocationSelector component using useMap from Leaflet
const LocationSelector = ({ onSelect }) => {
  const map = useMap();

  useEffect(() => {
    const onClick = (e) => {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map, onSelect]);

  return null;
};

export default function LocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [confirmedLocation, setConfirmedLocation] = useState(null);

  return (
    <div className="space-y-6 w-full p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Location Picker</h1>
        <p className="text-gray-600">Set your current location for better service.</p>
      </div>

      <Card className="rounded-2xl shadow-md bg-white">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="h-96 sm:h-[500px] rounded-lg overflow-hidden border border-gray-300">
            <MapContainer
              center={[26.455, 87.2718]} // Default to Biratnagar
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationSelector onSelect={setSelectedLocation} />
              {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
            </MapContainer>
          </div>

          {selectedLocation && (
            <Button
              className="w-full transition-all"
              onClick={() => setConfirmedLocation(selectedLocation)}
            >
              Confirm This Location
            </Button>
          )}

          {confirmedLocation && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">
                Selected coordinates: {confirmedLocation.lat.toFixed(6)}, {confirmedLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-green-600 mt-1">Location saved successfully</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
