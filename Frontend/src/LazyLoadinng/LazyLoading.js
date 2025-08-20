import { lazy } from 'react'
export const LazyHomePage=lazy(()=>import('../Pages/HomePage'))
export const LazyLoginPage=lazy(()=>import('../Pages/LoginPage'))
export const LazyRegisterPage=lazy(()=>import('../Pages/RegisterPage'))
export const LazyProfilePage=lazy(()=>import('../Pages/ProfilePage'))
export const LazyReportPage=lazy(()=>import('../Pages/ReportPage'))
export const LazyReportSectionPage=lazy(()=>import('../Pages/ReportSection'))
export const LazyDashboard=lazy(()=>import('../Pages/Dashboard'))