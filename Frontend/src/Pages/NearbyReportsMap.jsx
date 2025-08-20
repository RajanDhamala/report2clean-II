"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {Link} from 'react-router-dom';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function NearbyReportsMap() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(2); // in km
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔧 TEMPORARY MANUAL LOCATION OVERRIDE FOR TESTING
    const simulate = false; // set to false to use real GPS

    if (simulate) {
      setLocation({
        lat: 26.4525, // Biratnagar
        lng: 87.2718,
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => toast.error("Unable to fetch your location.")
      );
    }
  }, []);

  const fetchNearbyReports = async () => {
    if (!location || !radius) {
      toast.error("Location or radius missing");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/report/get/${location.lat}/${location.lng}/${radius}`,
        { withCredentials: true }
      );
      setReports(res.data.data || []);
      toast.success(`Found ${res.data.data.length} report(s) nearby.`);
    } catch (err) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">📍 Nearby Reports</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Input
          type="number"
          placeholder="Radius in km"
          min="0.5"
          step="0.5"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={fetchNearbyReports} disabled={!location || loading}>
          {loading ? "Loading..." : "Search Nearby"}
        </Button>
      </div>

      {location && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[500px] w-full rounded-xl shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {/* Draggable User Location */}
          <Marker
          icon={redIcon}
            position={[location.lat, location.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPos = marker.getLatLng();
                setLocation({ lat: newPos.lat, lng: newPos.lng });
                toast.success("Location updated by dragging marker.");
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent>
              You are here (Drag me)
            </Tooltip>
          </Marker>

          {/* Radius Circle */}
          <Circle
            center={[location.lat, location.lng]}
            radius={radius * 1000}
            pathOptions={{ fillColor: "blue", color: "blue", fillOpacity: 0.2 }}
          />


          {reports.map((report) => (
            <Marker
            icon={blueIcon}
              key={report._id}
              position={[
                report.location.coordinates[1],
                report.location.coordinates[0],
              ]}
            >
              <Tooltip>
                <div className="text-sm">
                 
                   <Link to='/login'><strong>{report.description}</strong></Link>
                  <p>By: {report.reported_by?.fullname || "Unknown"}</p>
                  <p>{new Date(report.createdAt).toLocaleString()}</p>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
