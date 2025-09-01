"use client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Clock,
  ImageIcon,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Default marker fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})

const fetchReport = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/report/view/${id}`)
  return res.data.data
}

const StatusBadge = ({ status }) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    resolved: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  }

  return (
    <Badge variant="outline" className={`${variants[status] || variants.pending} font-medium`}>
      <Clock className="w-3 h-3 mr-1" />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
    </Badge>
  )
}

const ImageModal = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        onNavigate("prev")
      } else if (e.key === "ArrowRight") {
        onNavigate("next")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  if (!isOpen || !images || images.length === 0) return null

  const currentImage = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content with slide animation */}
      <div className="relative z-10 max-w-5xl w-full animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <h3 className="font-semibold text-gray-900">Evidence Photo {currentIndex + 1}</h3>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {images.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-200">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Image Container */}
          <div className="relative p-4 bg-gray-50">
            {/* Navigation Arrows */}
            {hasPrev && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12"
                onClick={() => onNavigate("prev")}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}

            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12"
                onClick={() => onNavigate("next")}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}

            {/* Main Image */}
            <img
              src={currentImage || "/placeholder.svg"}
              alt={`Evidence Photo ${currentIndex + 1}`}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-sm mx-auto block"
            />
          </div>

          {/* Footer with thumbnails */}
          {images.length > 1 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-6 max-w-7xl">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-12 w-3/4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
          </div>
        </div>
        <Skeleton className="h-80" />
      </div>
    </div>
  </div>
)

const ViewReport = () => {
  const { reportId } = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => fetchReport(reportId),
  })

  const handleImageNavigation = (direction) => {
    if (!data?.images) return

    if (typeof direction === "number") {
      setSelectedImageIndex(direction)
    } else if (direction === "prev" && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    } else if (direction === "next" && selectedImageIndex < data.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Report Not Found</h2>
          <p className="text-muted-foreground">The report you're looking for could not be loaded.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const { description, address, images = [], location, status, urgency, createdAt, updatedAt } = data

  const [lng, lat] = location?.coordinates || [0, 0]

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <StatusBadge status={status} />
      </div>

      {/* Main Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{description}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{address}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Map Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 w-full overflow-hidden rounded-b-lg relative z-10">
                <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%", zIndex: 10 }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker position={[lat, lng]}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{description}</strong>
                        <br />
                        {address}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          {images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Evidence Photos ({images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-lg border cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <ZoomIn className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${urgency ? "text-red-500" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium">Priority</p>
                  <p className={`text-sm ${urgency ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                    {urgency ? "High Priority" : "Normal Priority"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Report Submitted</p>
                    <p className="text-sm text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {status === "resolved" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Report Resolved</p>
                      <p className="text-sm text-muted-foreground">{new Date(updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {status === "pending" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Under Review</p>
                      <p className="text-sm text-muted-foreground">In progress</p>
                    </div>
                  </div>
                )}

                {status === "rejected" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Report Rejected</p>
                      <p className="text-sm text-muted-foreground">{new Date(updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={images}
        currentIndex={selectedImageIndex}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        onNavigate={handleImageNavigation}
      />
    </div>
  )
}

export default ViewReport
