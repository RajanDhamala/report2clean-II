import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import {LazyHomePage,LazyLoginPage,LazyReportPage,LazyReportSectionPage,LazyRegisterPage,LazyProfilePage,
} from './LazyLoadinng/LazyLoading';
import Navbar from './Componnets/Navbar';
import { Toaster } from "react-hot-toast"
import { Recycle } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LocationPicker from '../src/Pages/LocationPicker'
const queryClient = new QueryClient();
function App() {

const Loader=()=>{
  return<>
         <div className="flex flex-col items-center justify-center p-8 h-screen">
      <div className="relative mb-4">
        <Recycle className="w-12 h-12 text-green-500 animate-spin" />
      </div>
      <p className="text-green-600 font-medium">Loading...</p>
    </div> 
  </>
}

  return (
    <>
      <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
            <Navbar/>
    <Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
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

        <Suspense fallback={<Loader/>}>
          <Routes>
            <Route path="/" element={<LazyHomePage />} />
            <Route path="/login" element={<LazyLoginPage />} />
            <Route path="/report" element={<LazyReportPage />} />
            <Route path="/reports" element={<LazyReportSectionPage />} />
            <Route path="/register" element={<LazyRegisterPage />} />
            <Route path="/profile" element={<LazyProfilePage />} />
             <Route path="/location" element={<LocationPicker />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
