import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  User,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Fetch all reports from backend
const fetchReports = async () => {
  const response = await axios.get("http://localhost:8000/report/seereport", {
    withCredentials: true,
  });
  return response.data.data;
};

export default function ViewReportsPage() {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        📋 Submitted Reports
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border shadow p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Failed to load reports.</p>
      ) : reports?.length === 0 ? (
        <p className="text-center text-gray-600">No reports submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = report.images || [];

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const getLocationLabel = () => {
    if (typeof report.location === "object" && report.location.coordinates) {
      const [lng, lat] = report.location.coordinates;
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return report.address || "Unknown";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border overflow-hidden flex flex-col">
      {images.length > 0 && (
        <div className="relative w-full h-48">
          <img
            src={images[currentImageIndex]}
            alt={`Report Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1 shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1 shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{report.description}</h3>

        <p className="flex items-center text-sm text-teal-700">
          <MapPin className="w-4 h-4 mr-1" />
          {getLocationLabel()}
        </p>

        <p className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-1" />
          Submitted by:{" "}
          <span className="ml-1 font-medium">
            {report.reported_by?.fullname || "Unknown"}
          </span>
        </p>

        <p className="flex items-center text-sm text-gray-600">
          <CalendarDays className="w-4 h-4 mr-1" />
          {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
