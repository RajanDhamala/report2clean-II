import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Upload,
  Crop,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera,
  Map,
  FileText,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import hotToast, { toast } from "react-hot-toast"

// React-Leaflet imports for React (no dynamic import like Next.js)
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Leaflet icon fix for default marker icons
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const createLeafletIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

const LocationPicker = ({ onSelect, initialPosition, currentLocation }) => {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const map = useMap()

  useEffect(() => {
    if (initialPosition) {
      map.setView(initialPosition, 13)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPosition])

  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng)
      onSelect(e.latlng)
    },
  })

  const blueIcon = createLeafletIcon("blue")
  const redIcon = createLeafletIcon("red")

  return (
    <>
      {currentLocation && blueIcon && <Marker position={currentLocation} icon={blueIcon} />}
      {selectedPosition && redIcon && <Marker position={selectedPosition} icon={redIcon} />}
    </>
  )
}

const ImageCropper = ({ image, onSave, onCancel }) => {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      drawCanvas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, imageLoaded])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = imageRef.current

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

    // Only draw overlay if crop area is selected
    if (crop.width !== 0 && crop.height !== 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillRect(crop.x, crop.y, crop.width, crop.height)

      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height)
    }
  }

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    setCrop({ x, y, width: 0, height: 0 })
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    const currentX = (e.clientX - rect.left) * scaleX
    const currentY = (e.clientY - rect.top) * scaleY

    setCrop((prev) => ({
      ...prev,
      width: currentX - prev.x,
      height: currentY - prev.y,
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const saveCroppedImage = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = imageRef.current

    canvas.width = Math.abs(crop.width)
    canvas.height = Math.abs(crop.height)

    const sourceX = crop.width < 0 ? crop.x + crop.width : crop.x
    const sourceY = crop.height < 0 ? crop.y + crop.height : crop.y
    const sourceWidth = Math.abs(crop.width)
    const sourceHeight = Math.abs(crop.height)

    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        const croppedFile = new File([blob], `cropped_${Date.now()}.png`, {
          type: "image/png",
        })
        onSave(croppedFile, canvas.toDataURL())
      },
      "image/png",
      0.9,
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Crop Image</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            ref={imageRef}
            src={image.preview || "/placeholder.svg"}
            alt="Original"
            onLoad={() => setImageLoaded(true)}
            className="hidden"
          />
          <div className="relative max-w-full max-h-96 overflow-hidden border rounded">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="max-w-full max-h-96 cursor-crosshair"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Click and drag to select the area you want to keep</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={saveCroppedImage} disabled={crop.width === 0 || crop.height === 0}>
              Save Crop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ReportPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [description, setDescription] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [location, setLocation] = useState(null)
  const [locationEnabled, setLocationEnabled] = useState(null)
  const [images, setImages] = useState([])
  const [cropImage, setCropImage] = useState(null)
  const [selectedMapLocation, setSelectedMapLocation] = useState(null)

  const MAX_IMAGES = 5

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/report/createReport`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Report submitted successfully!")
      setTimeout(() => navigate('/reports'), 1500)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to submit report")
    },
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        setLocationEnabled(true)
      },
      () => {
        setLocationEnabled(false)
        setLocation({ lat: 26.5049, lng: 87.2903 }) // Default to Biratnagar
        toast.error("Location access denied. Defaulting to Biratnagar.")
      },
    )
  }, [])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    const maxSize = 5 * 1024 * 1024

    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const newImages = validFiles.map((file) => {
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name,
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(newImages).then((newImages) => {
      setImages((prev) => [...prev, ...newImages])
    })

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCropImage = (image) => {
    setCropImage(image)
  }

  const handleCropSave = (croppedFile, croppedPreview) => {
    setImages((prev) => [
      ...prev.filter((img) => img.id !== cropImage.id),
      {
        id: Date.now() + Math.random(),
        file: croppedFile,
        preview: croppedPreview,
        name: `cropped_${cropImage.name}`,
      },
    ])
    setCropImage(null)
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = []
    if (!description.trim()) errors.push("Description is required")
    if (images.length === 0) errors.push("At least one image is required")
    if (!selectedMapLocation) errors.push("Please select an accurate location on the map")

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
      return
    }

    const formData = new FormData()
    formData.append("description", description)
    formData.append("location", manualLocation.trim())
    formData.append("coordinates", `${selectedMapLocation.lat},${selectedMapLocation.lng}`)
    images.forEach((img) => formData.append("images", img.file))

    mutate(formData)
  }

  const steps = [
    { number: 1, title: "Description", icon: FileText },
    { number: 2, title: "Images", icon: Camera },
    { number: 3, title: "Location", icon: Map },
  ]

  const canProceedFromStep1 = description.trim().length > 0
  const canProceedFromStep2 = images.length > 0
  const canSubmit = canProceedFromStep1 && canProceedFromStep2 && selectedMapLocation

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Cleanliness Report</h1>
          <p className="text-muted-foreground">Help improve your community by reporting cleanliness issues</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = step === stepItem.number
              const isCompleted = step > stepItem.number

              return (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center gap-3 ${
                      isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-muted bg-background"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="font-medium hidden sm:block">{stepItem.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${step > stepItem.number ? "bg-green-600" : "bg-muted"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Description */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Describe the Issue</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please describe the cleanliness issue in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location Description (Optional)</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g., Near central park, main street..."
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    {locationEnabled && location && (
                      <Alert>
                        <MapPin className="w-4 h-4" />
                        <AlertDescription>
                          GPS Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canProceedFromStep1}>
                    Next: Upload Images
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
                  <div className="mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={images.length >= MAX_IMAGES}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image ({images.length}/{MAX_IMAGES})
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload images showing the cleanliness issue. You can crop images after uploading.
                    </p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={img.name}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCropImage(img)}
                              className="h-8 w-8 p-0"
                            >
                              <Crop className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(img.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {images.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No images uploaded yet</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceedFromStep2}>
                    Next: Select Location
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Location</h3>

                  <Alert className="mb-4">
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Click on the map to select the accurate location of the issue.</strong>
                      <br />
                      Blue marker: Your current location | Red marker: Selected issue location
                    </AlertDescription>
                  </Alert>

                  <div className="border rounded-lg overflow-hidden">
                    <MapContainer
                      center={location || [26.5049, 87.2903]}
                      zoom={13}
                      style={{ height: "400px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationPicker
                        onSelect={setSelectedMapLocation}
                        initialPosition={location || [26.5049, 87.2903]}
                        currentLocation={location}
                      />
                    </MapContainer>
                  </div>

                  {selectedMapLocation && (
                    <Alert>
                      <Check className="w-4 h-4" />
                      <AlertDescription>
                        Selected location: {selectedMapLocation.lat.toFixed(4)}, {selectedMapLocation.lng.toFixed(4)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Submitted
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {cropImage && <ImageCropper image={cropImage} onSave={handleCropSave} onCancel={() => setCropImage(null)} />}
      </div>
    </div>
  )
}