import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Upload,
  Eye,
  Check,
  Send,
  Clock,
  ArrowLeft,
  X,
  CheckCircle,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LocationSelector = ({ onSelect }) => {
  const map = useMap();
  React.useEffect(() => {
    const onClick = (e) => {
      onSelect([e.latlng.lat, e.latlng.lng]);
    };
    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map, onSelect]);
  return null;
};

export default function AuthenticateUser({ isVerified = true,date, onVerificationChange,setActiveTab }) {
  const navigate=useNavigate()
  const [verificationStep, setVerificationStep] = useState(1);
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [confirmedLocation, setConfirmedLocation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReauth, setShowReauth] = useState(false);

  const idInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const isValidImageFile = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/png"];
    return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
  };

  const handleImageUpload = (e, setImage, label) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      toast.error("Please upload a valid JPG or PNG image under 5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setIsUploading(false);
      toast.success(`${label} selected!`);
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Could not read the file. Please try again.");
    };
    reader.readAsDataURL(file);

    if (label === "Government ID") setIdFile(file);
    if (label === "Selfie") setSelfieFile(file);
  };

  const handleSubmit = async () => {
    if (!idFile || !selfieFile || !confirmedLocation) {
      toast.error("Please complete all steps before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("idImage", idFile);
    formData.append("selfieImage", selfieFile);
    formData.append("location", JSON.stringify(confirmedLocation));
    formData.append("timestamp", new Date().toISOString());

    setIsSubmitting(true);

    try {
      const req=await axios.post(`${import.meta.env.VITE_BASE_URL}/user/authencation`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success("Your verification data has been sent for review.");
      setActiveTab('overview')
      handleReauth()
      if (onVerificationChange) {
        setTimeout(() => {
          onVerificationChange(true);
          navigate('/')
          
        }, 2000);
      }
    } catch (err) {
      toast.error("Could not submit your data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReauth = () => {
    setShowReauth(true);
    setVerificationStep(1);
    setIdImage(null);
    setSelfieImage(null);
    setIdFile(null);
    setSelfieFile(null);
    setSelectedLocation(null);
    setConfirmedLocation(null);
  };

  const goBack = () => {
    if (verificationStep > 1) {
      setVerificationStep(verificationStep - 1);
    }
  };

  const removeImage = (setImage) => {
    setImage(null);
    if (setImage === setIdImage) setIdFile(null);
    if (setImage === setSelfieImage) setSelfieFile(null);
  };

  // Verified UI
  if (isVerified && !showReauth) {
    return (
  <div className=" w-full  mx-auto">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Verification</h1>
    <p className="text-gray-600 mt-1">Your account has been successfully verified.</p>
  </div>

  <Card className="rounded-2xl shadow-md bg-white border-green-200">
    <CardHeader className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-green-800">
        <CheckCircle className="w-6 h-6 text-green-600" /> 
        Verification Complete
      </CardTitle>
    </CardHeader>

    <CardContent className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[{
          icon: FileText,
          title: "Identity Verified",
          subtitle: "Government ID confirmed"
        }, {
          icon: User,
          title: "Photo Verified",
          subtitle: "Selfie authentication passed"
        }, {
          icon: MapPin,
          title: "Location Confirmed",
          subtitle: "Geographic verification complete"
        }, {
          icon: Calendar,
          title: "Verification Date",
          subtitle: date || new Date().toLocaleDateString()
        }].map(({ icon: Icon, title, subtitle }, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 min-w-0"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div className="break-words">
              <p className="font-medium text-green-800">{title}</p>
              <p className="text-sm text-green-600 mt-0.5">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Account Security</h4>
            <p className="text-sm text-blue-600 mt-1">
              Your account is fully verified and secured. You now have access to all platform features 
              including advanced trading, higher transaction limits, and priority support.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-medium text-gray-700">Verification Status:</span>
          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200 inline-flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> Verified
          </Badge>
        </div>
        <Button
          variant="outline"
          onClick={handleReauth}
          className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 whitespace-nowrap"
        >
          <RefreshCw className="w-4 h-4" />
          Re-authenticate
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

    );
  }

  // Verification Form UI
  return (
    <div className="space-y-6 p-6 w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Verification</h1>
        <p className="text-gray-600">
          {showReauth ? "Update your verification documents" : "Complete verification to unlock all features."}
        </p>
      </div>

      <Card className="rounded-2xl shadow-md bg-white">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" /> 
            {showReauth ? "Re-authentication Process" : "Verification Process"}
          </CardTitle>
          {showReauth && (
            <p className="text-sm text-gray-600 mt-2">
              Update your documents to maintain account security
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
         <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-2 sm:justify-between">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
              step <= verificationStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < verificationStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`h-0.5 mx-1 sm:mx-3 transition-all ${
                step < verificationStep ? "bg-blue-600" : "bg-gray-200"
              }`}
              style={{ width: "2rem", minWidth: "1.5rem" }}
            />
          )}
        </div>
      ))}
    </div>

          {/* Step 1 */}
          {verificationStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 1: Upload Government ID</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {idImage ? (
                  <div className="relative">
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={idImage}
                        alt="ID Preview"
                        className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(setIdImage)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        type="button"
                        aria-label="Remove ID"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Government ID selected
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Upload your government-issued ID
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Accepted formats: JPG, PNG (max 5MB)
                    </p>
                    <input
                      ref={idInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) =>
                        handleImageUpload(e, setIdImage, "Government ID")
                      }
                      style={{ display: "none" }}
                      id="id-upload"
                      tabIndex={-1}
                    />
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      disabled={isUploading}
                      type="button"
                      onClick={() => idInputRef.current && idInputRef.current.click()}
                    >
                      {isUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {showReauth && (
                  <Button
                    variant="outline"
                    onClick={() => setShowReauth(false)}
                    className="flex items-center gap-2"
                    type="button"
                  >
                    <ArrowLeft className="w-4 h-4" /> Cancel
                  </Button>
                )}
                {idImage && (
                  <Button
                    onClick={() => setVerificationStep(2)}
                    className="flex-1"
                    disabled={isUploading}
                    type="button"
                  >
                    Continue to Step 2
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {verificationStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 2: Upload Selfie</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {selfieImage ? (
                  <div className="relative">
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={selfieImage}
                        alt="Selfie Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(setSelfieImage)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        type="button"
                        aria-label="Remove Selfie"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Selfie selected
                    </p>
                  </div>
                ) : (
                  <div>
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Take a clear selfie for verification
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Make sure your face is clearly visible (max 5MB)
                    </p>
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) =>
                        handleImageUpload(e, setSelfieImage, "Selfie")
                      }
                      style={{ display: "none" }}
                      id="selfie-upload"
                      tabIndex={-1}
                    />
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      disabled={isUploading}
                      type="button"
                      onClick={() =>
                        selfieInputRef.current && selfieInputRef.current.click()
                      }
                    >
                      {isUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {selfieImage && (
                  <Button
                    onClick={() => setVerificationStep(3)}
                    className="flex-1"
                    disabled={isUploading}
                    type="button"
                  >
                    Continue to Step 3
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {verificationStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 3: Select Location</h3>
              <MapContainer
                center={[26.455, 87.2718]}
                zoom={13}
                className="h-96 sm:h-[500px] rounded-lg overflow-hidden border border-gray-300"
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector onSelect={setSelectedLocation} />
                {selectedLocation && <Marker position={selectedLocation} />}
              </MapContainer>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {selectedLocation && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setConfirmedLocation(selectedLocation);
                      setVerificationStep(4);
                    }}
                  >
                    Confirm Location and Continue
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {verificationStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 4: Review & Submit</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Government ID</span>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Selfie Photo</span>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Location</span>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"></path>
                      </svg>
                      {showReauth ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> 
                      {showReauth ? "Update Documents" : "Submit for Review"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Status:</span>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="w-3 h-3 mr-1" /> 
              {showReauth ? "Updating Documents" : "Pending Review"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}