import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { LazyHomePage, LazyLoginPage, LazyReportPage, LazyReportSectionPage, LazyRegisterPage, LazyProfilePage,LazyDashboard,} from './LazyLoadinng/LazyLoading';
import Navbar from './Componnets/Navbar';
import { Toaster, toast } from "react-hot-toast"; 
import { Recycle } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LocationPicker from './Pages/LocationPicker';
import NearbyReportsMap from './Pages/NearbyReportsMap';
import Cookies from "js-cookie";
import userStore from './Zustand/UserStore';
import Dashboard from './Pages/Dashboard';
import ViewReport from './Componnets/ViewReport';
import ProtectedRoute from './Pages/ProtectRoute';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  const currentUser = userStore((state) => state.currentUser);
  const SetcurrentUser = userStore((state) => state.SetcurrentUser); 

 useEffect(() => {
  
const rawCookie = Cookies.get("currentUser");
let initialUser = null;

if (rawCookie) {
  try {
    initialUser = JSON.parse(rawCookie);
    SetcurrentUser(initialUser);
  } catch (err) {
    console.error("Failed to parse cookie:", err);
  }
}
}, [SetcurrentUser]);


  const Loader = () => (
    <div className="flex flex-col items-center justify-center p-8 h-screen">
      <div className="relative mb-4">
        <Recycle className="w-12 h-12 text-green-500 animate-spin" />
      </div>
      <p className="text-green-600 font-medium">Loading...</p>
    </div>
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Navbar />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#363636",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                borderRadius: "0.75rem",
                padding: "16px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <Suspense fallback={<Loader />}>
             <Routes>
      {/* Public routes */}
      <Route path="/" element={<LazyHomePage />} />
      <Route path="/login" element={<LazyLoginPage />} />
      <Route path="/report" element={<LazyReportPage />} />
      <Route path="/reports" element={<LazyReportSectionPage />} />
      <Route path="/register" element={<LazyRegisterPage />} />
      <Route path="/profile" element={<LazyDashboard />} />
      <Route path="/location" element={<LocationPicker />} />
      <Route path="/view-report/:reportId" element={<ViewReport />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/map" element={<NearbyReportsMap />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
