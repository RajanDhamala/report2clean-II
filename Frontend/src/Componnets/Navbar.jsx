import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Notification from "./Notification";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  const baseLinkClass =
    "transition-colors duration-150";
  const desktopLinkClass =
    baseLinkClass + " hover:underline";
  const mobileLinkClass =
    baseLinkClass + " block px-2 py-2 rounded hover:bg-teal-600";
  const activeDesktop =
    "underline font-semibold";
  const activeMobile =
    "bg-teal-800 font-semibold";

  return (
    <nav className="bg-teal-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Brand */}
          <NavLink
            to="/"
            className="text-2xl font-bold tracking-wide"
            onClick={closeMenu}
          >
            Report2Clean
          </NavLink>

            {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <NavItems
              desktop
              linkClass={desktopLinkClass}
              activeClass={activeDesktop}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none p-2 rounded hover:bg-teal-600"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavItems
            linkClass={mobileLinkClass}
            activeClass={activeMobile}
            onNavigate={closeMenu}
          />
        </div>
      )}
    </nav>
  );
}

function NavItems({
  desktop = false,
  linkClass,
  activeClass,
  onNavigate = () => {},
}) {
  // You can later make this dynamic (e.g., based on auth state)
  const isAuthenticated = true; // placeholder

  return (
    <>
      <SmartLink
        to="/"
        label="Home"
        linkClass={linkClass}
        activeClass={activeClass}
        onNavigate={onNavigate}
      />
      <SmartLink
        to="/report"
        label="Submit Report"
        linkClass={linkClass}
        activeClass={activeClass}
        onNavigate={onNavigate}
      />
      <SmartLink
        to="/reports"
        label="View Reports"
        linkClass={linkClass}
        activeClass={activeClass}
        onNavigate={onNavigate}
      />
           <SmartLink
        to="/dashboard"
        label="Dashboard"
        linkClass={linkClass}
        activeClass={activeClass}
        onNavigate={onNavigate}
      />
      {/* Notification component (adjust styling if needed) */}
      <div onClick={onNavigate}>
        <Notification />
      </div>
      {isAuthenticated ? (
        <SmartLink
          to="/profile"
            label="Profile"
          linkClass={
            linkClass +
            " bg-red-300 bg-opacity-20 px-4 py-2 rounded-lg font-bold hover:bg-opacity-30"
          }
          activeClass={activeClass}
          onNavigate={onNavigate}
        />
      ) : (
        <>
          <SmartLink
            to="/login"
            label="Login"
            linkClass={linkClass}
            activeClass={activeClass}
            onNavigate={onNavigate}
          />
          <SmartLink
            to="/register"
            label="Register"
            linkClass={linkClass}
            activeClass={activeClass}
            onNavigate={onNavigate}
          />
        </>
      )}
    </>
  );
}

function SmartLink({ to, label, linkClass, activeClass, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${linkClass} ${isActive ? activeClass : ""}`.trim()
      }
      end={to === "/"} // so only exact / matches Home
    >
      {label}
    </NavLink>
  );
}

export default Navbar;
