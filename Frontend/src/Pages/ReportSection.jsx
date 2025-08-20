"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Fetch with pagination
const fetchReports = async ({ queryKey }) => {
  const [, page] = queryKey;
  const response = await axios.get(`http://localhost:8000/report/seereport?page=${page}`, {
    withCredentials: true,
  });
  return response.data.data;
};

export default function ViewReportsPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports", page],
    queryFn: fetchReports,
    keepPreviousData: true,
  });

  const reports = data?.reports || [];
  const totalReports = data?.totalReports || 0;
  const totalPages = Math.ceil(totalReports / 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cleanliness Reports</h1>
          <p className="text-gray-600">View and manage community cleanliness reports</p>
        </div>

        {/* Loading */}
        {isLoading && <LoadingGrid />}

        {/* Error */}
        {error && <ErrorState onRetry={refetch} />}

        {/* Empty */}
        {!isLoading && !error && reports.length === 0 && <EmptyState />}

        {/* Grid */}
        {reports.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {totalReports} report{totalReports !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <span className="text-sm text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array.isArray(report.images) ? report.images : [];

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const getLocationLabel = () => {
    if (report.location?.coordinates) {
      const [lng, lat] = report.location.coordinates;
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return report.address || "Unknown Location";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`Report ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=300";
              }}
            />
            {images.length > 1 && (
              <>
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {images.length}
                </div>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-sm transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-sm transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <div className="mb-4">
          <p className="text-base text-gray-900 leading-5 line-clamp-2">
            {report.description || "No description provided"}
          </p>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 mb-0.5">Location</p>
              <p className="text-sm text-gray-600 break-words">{report.address || getLocationLabel()}</p>
              {report.address && <p className="text-xs text-gray-500 font-mono mt-1">{getLocationLabel()}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 mb-0.5">Reported by</p>
              <p className="text-sm text-gray-600 truncate">{report.reported_by?.fullname || "Anonymous"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 mb-0.5">Submitted</p>
              <p className="text-sm text-gray-600">{formatDate(report.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <Button
            onClick={() => navigate(`/view-report/${report._id}`)}
            variant="outline"
            className="w-full text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 transition-colors duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-100 animate-pulse"></div>
          <CardContent className="p-5">
            <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded mt-0.5 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load reports</h3>
      <p className="text-gray-600 mb-6">There was an error loading the reports. Please try again.</p>
      <Button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
      <p className="text-gray-600">No cleanliness reports have been submitted yet.</p>
    </div>
  );
}
