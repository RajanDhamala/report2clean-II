"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, CheckCircle2, MapPin, Upload, Crop, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ReportPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [location, setLocation] = useState(null)
  const [manualLocation, setManualLocation] = useState("")
  const [locationEnabled, setLocationEnabled] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const [cropSelection, setCropSelection] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const MAX_IMAGES = 5

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("http://localhost:8000/report/createReport", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Report submitted successfully!")
      setTimeout(() => {
        navigate("/reports")
      }, 1500)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to submit report")
    },
  })

  useEffect(() => {
    const askForLocation = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        setLocationEnabled(permission.state === "granted")

        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords
              setLocation({ lat: latitude, lng: longitude })
            },
            () => {
              setLocationEnabled(false)
              toast.error("Unable to get your location")
            },
          )
        }
      } catch {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords
            setLocation({ lat: latitude, lng: longitude })
            setLocationEnabled(true)
          },
          () => {
            setLocationEnabled(false)
            toast.error("Location access denied")
          },
        )
      }
    }
    askForLocation()
  }, [])

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed")
      return false
    }

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB")
      return false
    }

    return true
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const validFiles = files.filter(validateImage)

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
        }
        setImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const validFiles = files.filter(validateImage)

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
        }
        setImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
    toast.success("Image removed")
  }

  const startCrop = (image) => {
    setCropImage(image)
    setCropSelection({ x: 0, y: 0, width: 0, height: 0 })
  }

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setStartPoint({ x, y })
    setIsSelecting(true)
    setCropSelection({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e) => {
    if (!isSelecting) return

    const rect = e.target.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    setCropSelection({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y),
    })
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const applyCrop = () => {
    if (!cropImage || cropSelection.width === 0 || cropSelection.height === 0) {
      toast.error("Please select an area to crop")
      return
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate the actual image dimensions vs display dimensions
      const displayImg = document.getElementById(`crop-preview-${cropImage.id}`)
      const scaleX = img.naturalWidth / displayImg.width
      const scaleY = img.naturalHeight / displayImg.height

      // Set canvas size to crop selection
      canvas.width = cropSelection.width * scaleX
      canvas.height = cropSelection.height * scaleY

      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropSelection.x * scaleX,
        cropSelection.y * scaleY,
        cropSelection.width * scaleX,
        cropSelection.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      )

      canvas.toBlob(
        (blob) => {
          const croppedFile = new File([blob], `cropped_${cropImage.name}`, { type: blob.type })
          const reader = new FileReader()
          reader.onload = (e) => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === cropImage.id ? { ...img, file: croppedFile, preview: e.target.result } : img,
              ),
            )
            setCropImage(null)
            setCropSelection({ x: 0, y: 0, width: 0, height: 0 })
            toast.success("Image cropped successfully")
          }
          reader.readAsDataURL(croppedFile)
        },
        "image/jpeg",
        0.9,
      )
    }

    img.src = cropImage.preview
  }

  const handleLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        setLocationEnabled(true)
        toast.success("Location detected successfully")
      },
      () => {
        setLocationEnabled(false)
        toast.error("Unable to access location")
      },
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!description.trim()) {
      toast.error("Please provide a description")
      return
    }

    // Check if we have either manual location or coordinates
    if (!manualLocation.trim() && !location) {
      toast.error("Please provide location information")
      return
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    const formData = new FormData()
    formData.append("description", description)

    // Always send both manual location and coordinates if available
    formData.append("location", manualLocation.trim() || "")
    formData.append("coordinates", location ? `${location.lat},${location.lng}` : "")

    images.forEach((image) => {
      formData.append("images", image.file)
    })

    mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Submit a Cleanliness Report</h2>
              <p className="text-gray-600">Help keep our community clean by reporting issues</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <Textarea
                  placeholder="Describe the cleanliness issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>

                <div className="space-y-3">
                  {/* Auto-detected location status */}
                  {locationEnabled === null ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm p-3 bg-gray-50 rounded-md">
                      <Loader2 className="animate-spin w-4 h-4" />
                      Checking location permissions...
                    </div>
                  ) : locationEnabled && location ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">GPS coordinates detected</span>
                      </div>
                      <span className="text-xs text-green-600">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLocationPermission}
                      className="w-full sm:w-auto"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Enable GPS Location
                    </Button>
                  )}

                  {/* Manual location input - always visible */}
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter location manually (e.g., Street name, Area, City)"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      required={!location}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {location
                        ? "Manual location will be sent along with GPS coordinates"
                        : "Manual location is required since GPS is not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images * (Max {MAX_IMAGES})</label>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= MAX_IMAGES}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">JPEG, PNG, WebP up to 5MB each</p>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Images ({images.length}/{MAX_IMAGES})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => startCrop(image)}
                              className="h-8 w-8 p-0"
                            >
                              <Crop className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(image.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending || isSuccess} size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      Submitting Report...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Report Submitted!
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Crop Modal */}
        {cropImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      id={`crop-preview-${cropImage.id}`}
                      src={cropImage.preview || "/placeholder.svg"}
                      alt="Crop preview"
                      className="w-full h-auto max-h-96 object-contain cursor-crosshair"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      draggable={false}
                    />
                    {/* Selection overlay */}
                    {cropSelection.width > 0 && cropSelection.height > 0 && (
                      <div
                        className="absolute border-2 bg-transaprent bg-opacity-20"
                        style={{
                          left: cropSelection.x,
                          top: cropSelection.y,
                          width: cropSelection.width,
                          height: cropSelection.height,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Click and drag to select the area you want to crop</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyCrop}
                      className="flex-1"
                      disabled={cropSelection.width === 0 || cropSelection.height === 0}
                    >
                      Apply Crop
                    </Button>
                    <Button variant="outline" onClick={() => setCropImage(null)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportPage
