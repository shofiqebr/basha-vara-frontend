"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.webp";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#111827] text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image className="rounded-full" src={logo} alt="BashaFinder Logo" width={50} height={50} />
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
            className={`md:flex space-x-6 text-lg absolute md:static top-16 left-0 w-full bg-[#111827] md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out ${
              isMenuOpen ? "block" : "hidden md:flex"
            }`}
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/listings">All Listed Rental Housing</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link href="/profile">My Profile</Link></li>
                <li>
                  <button className="text-red-400">Logout</button>
                </li>
              </>
            ) : (
              <li><Link href="/login">Login / Register</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
