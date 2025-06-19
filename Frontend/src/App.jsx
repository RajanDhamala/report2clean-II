import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import {LazyHomePage,LazyLoginPage,LazyReportPage,LazyReportSectionPage,LazyRegisterPage,LazyProfilePage,
} from './LazyLoadinng/LazyLoading';
import Navbar from './Componnets/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
            <Navbar/>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LazyHomePage />} />
            <Route path="/login" element={<LazyLoginPage />} />
            <Route path="/report" element={<LazyReportPage />} />
            <Route path="/reports" element={<LazyReportSectionPage />} />
            <Route path="/register" element={<LazyRegisterPage />} />
            <Route path="/profile" element={<LazyProfilePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
