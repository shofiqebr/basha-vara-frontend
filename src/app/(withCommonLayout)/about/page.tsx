"use client";

import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-[600px] bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-yellow-600 mb-6">About Us</h1>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Welcome to <span className="text-yellow-500 font-semibold">Basha Vara</span> – your trusted
          platform for finding and renting homes easily. Whether you’re a landlord looking to post your
          property or a tenant searching for the perfect place, we make the process simple, fast, and
          secure.
        </p>

        <p className="text-gray-400 mb-8">
          Our mission is to bridge the gap between landlords and tenants with a modern, user-friendly
          experience. Built with the MERN stack, our platform is optimized for performance, accessibility,
          and reliability.
        </p>

        <p className="text-gray-400 mb-8">
          We’re constantly working to improve the platform and bring more powerful features like real-time
          notifications, secure payment handling, and robust user dashboards.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
