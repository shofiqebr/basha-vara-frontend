"use client";

import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6 mx-6 mt-10">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 text-center mb-10">
          About Basha Vara
        </h1>

        {/* Intro Section */}
        <section className="mb-12 text-center">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            <span className="text-yellow-500 font-semibold">Basha Vara</span> is more than just a rental platform —
            it&apos;s a modern solution for renters and landlords in Bangladesh. Whether you&apos;re seeking your next
            home or listing a property, our platform simplifies the process with trust, transparency, and technology.
          </p>
        </section>

        {/* Mission, Vision, and Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">🚀 Our Mission</h3>
            <p className="text-gray-300 text-sm">
              To bridge the gap between landlords and tenants by offering a seamless, secure, and efficient rental experience.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">🌍 Our Vision</h3>
            <p className="text-gray-300 text-sm">
              Empower people to find safe, affordable homes and enable landlords to manage rentals with ease — all in one platform.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">💡 Our Values</h3>
            <p className="text-gray-300 text-sm">
              Trust, simplicity, transparency, and constant innovation drive everything we do.
            </p>
          </div>
        </section>

        {/* Tech & Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-500 text-center mb-6">What Powers Us</h2>
          <ul className="text-gray-300 space-y-3 list-disc list-inside max-w-3xl mx-auto">
            <li>Built with the robust MERN stack (MongoDB, Express, React, Node.js)</li>
            <li>Responsive and accessible UI with modern UX practices</li>
            <li>Real-time notifications and secure communication</li>
            <li>Role-based dashboards for tenants, landlords, and admins</li>
            <li>Secure payment gateway integration</li>
          </ul>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to start your rental journey?
          </h3>
          <Link
            href="/"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg text-lg transition"
          >
            Explore Listings Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
