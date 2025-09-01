import React, { useState, useEffect } from "react";
import { Menu, X, User, FileText, BarChart3, Bell, LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NotificationPanel from "./Notification"
import userStore from "../Zustand/UserStore";
const navLinks = [
  { id: "home", label: "Home", icon: <User className="w-5 h-5 mr-3" />, path: "/" },
  { id: "report", label: "Submit Report", icon: <FileText className="w-5 h-5 mr-3" />, path: "/report" },
  { id: "reports", label: "View Reports", icon: <BarChart3 className="w-5 h-5 mr-3" />, path: "/reports" },
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5 mr-3" />, path: "/profile" },
];

const authLinks = [
  { id: "login", label: "Login", icon: <LogIn className="w-5 h-5 mr-3" />, path: "/login" },
  { id: "register", label: "Register", icon: <UserPlus className="w-5 h-5 mr-3" />, path: "/register" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current user from Zustand store
  const currentUser = userStore((state) => state.currentUser);

  // Debug logging
  console.log("Current user in navbar:", currentUser);
  console.log("User is logged in:", !!currentUser);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleNotification = () => setNotificationOpen((prev) => !prev);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationOpen && !event.target.closest('.notification-container')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Determine which links to show based on user authentication
  const isLoggedIn = Boolean(currentUser && (currentUser.email || currentUser.username || currentUser._id));
const linksToShow = isLoggedIn 
    ? navLinks 
    : [navLinks[0], navLinks[2], ...authLinks]; 
  
  console.log("Is logged in:", isLoggedIn);
  console.log("Links to show:", linksToShow.map(link => link.label));
  
  // Update active link based on current path
  const activeLink = linksToShow.find(link => link.path === location.pathname)?.id || "home";

  const handleLinkClick = (link) => {
    navigate(link.path);
    setIsOpen(false);
    setNotificationOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
  {/* Logo */}
  <div className="flex items-center">
    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
      <span className="text-white font-bold text-sm">R2C</span>
    </div>
    <button
      onClick={() => handleLinkClick(navLinks[0])}
      className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors"
    >
      Report2Clean
    </button>
  </div>

  {/* Desktop Menu */}
  <div className="hidden md:flex items-center space-x-8">
    {linksToShow.map((link) => (
      <button
        key={link.id}
        onClick={() => handleLinkClick(link)}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          activeLink === link.id
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-700 hover:text-green-600"
        }`}
      >
        {link.label}
      </button>
    ))}

    {/* Notification Bell - Only show if user is logged in */}
    {isLoggedIn && (
      <div className="relative notification-container">
       
          <div className="">
            <NotificationPanel onClose={() => setNotificationOpen(false)} />
          </div>

      </div>
    )}
  </div>

  {/* Mobile buttons */}
  <div className="flex md:hidden items-center space-x-4 ">
    {/* Notification Icon */}
    <div className="relative">
     <NotificationPanel/>
    </div>

    {/* Hamburger Menu */}
    <button
      onClick={toggleMenu}
      className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors"
      aria-label="Toggle menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  </div>
</div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 md:hidden h-screen w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R2C</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Report<span className="text-green-500">2Clean</span>
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {linksToShow.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                activeLink === link.id ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Notification Bell Component with unread count
function NotificationBell({ isOpen, onClick, isMobile = false }) {
  const { data: notificationshai = { notifications: [] } } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/notifications`, {
        withCredentials: true,
      });
      return { notifications: res.data.data || [] };
    },
    staleTime: 1000 * 60 * 5,
  });

  const unreadCount = notificationshai.notifications.filter(n => !n.isReaded).length;

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center p-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50"
      >
        <div className="relative">
          <Bell className="w-5 h-5 mr-3 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        Notifications
        {unreadCount > 0 && (
          <span className="ml-auto px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Bell className="w-6 h-6 text-gray-600" />
      {unreadCount > 0 && (
        <>
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1 shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </>
      )}
    </button>
  );
}

export default Navbar;
