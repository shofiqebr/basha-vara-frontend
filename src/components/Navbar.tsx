"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.webp";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const user = JSON.parse(loginData);
      setIsAuthenticated(true);
      setUserEmail(user.email); // Assuming loginData has an `email` field
      setUserRole(user?.role);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  

  return (
    <nav className="bg-[#111827] text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            className="rounded-full"
            src={logo}
            alt="BashaFinder Logo"
            width={50}
            height={50}
          />
        </Link>

        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>

          {/* Navigation Links */}
          <ul
            className={`md:flex space-x-6 text-lg absolute md:static top-16 left-0 w-full bg-[#1F2937] md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out ${
              isMenuOpen ? "block" : "hidden md:flex"
            }`}
          >
            <li>
              <Link
                className="text-white font-semibold hover:text-[#D97706] transition duration-300"
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-white font-semibold hover:text-[#D97706] transition duration-300"
                href="/about"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-white font-semibold hover:text-[#D97706] transition duration-300"
                href="/listings"
              >
                All Listed Rentals
              </Link>
            </li>
            {userRole === "tenant" && (
              <li>
                <Link
                  className="text-white font-semibold hover:text-[#D97706] transition duration-300"
                  href="/rental-request"
                >
                  Rental Requests
                </Link>
              </li>
            )}
            <li>
              <Link
                className="text-white font-semibold hover:text-[#D97706] transition duration-300"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="text-[#D97706] font-semibold">{userEmail}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-[#D97706] hover:text-red-400 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  className="text-[#D97706] hover:text-white transition duration-300"
                  href="/login"
                >
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
