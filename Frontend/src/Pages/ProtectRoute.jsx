
// ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";
import userStore from "../Zustand/UserStore";

export default function ProtectedRoute() {
  const currentUser = userStore((state) => state.currentUser);

  // Show toast if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error("⚠ You must be logged in to access this page.");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

