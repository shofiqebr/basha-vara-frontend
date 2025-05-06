"use client";

import React from "react";


const LandingExtraSections = () => {
  return (
    <div className="space-y-10 px-6 py-10">
      {/* Offers Section */}
      <section className="bg-gray-900 text-white py-16 px-4 mx-2 rounded-xl   text-center shadow-md">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">🔥 Current Offers & Promotions</h2>
        <p className="text-gray-300 mb-6">Get discounts on your first month’s rent, festive season offers, and more!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">🎉 First-Time Tenant Offer</h3>
            <p className="text-gray-400 mt-2">Get 20% off on your first booking.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">🏡 Eid Festival Deal</h3>
            <p className="text-gray-400 mt-2">Flat ৳1000 cashback for listings confirmed during Eid.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">👨‍👩‍👧‍👦 Family Special</h3>
            <p className="text-gray-400 mt-2">No service charge for verified families this month.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 text-white py-16 px-4 rounded-xl mx-2 text-center shadow-md">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">📌 How It Works</h2>
        <p className="text-gray-300 mb-6">Find and rent your perfect home in just a few easy steps.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl mb-2">🔍</div>
            <h4 className="font-semibold text-yellow-400">Search</h4>
            <p className="text-sm text-gray-400">Find listings by area, price, or category.</p>
          </div>
          <div>
            <div className="text-4xl mb-2">📩</div>
            <h4 className="font-semibold text-yellow-400">Request</h4>
            <p className="text-sm text-gray-400">Submit rental requests directly to landlords.</p>
          </div>
          <div>
            <div className="text-4xl mb-2">💳</div>
            <h4 className="font-semibold text-yellow-400">Pay</h4>
            <p className="text-sm text-gray-400">Use our secure payment system.</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🚚</div>
            <h4 className="font-semibold text-yellow-400">Move</h4>
            <p className="text-sm text-gray-400">Get moving once you&apos;re approved!</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-900 text-white py-16 px-4 rounded-xl mx-2 text-center shadow-md">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">🌟 Why Choose Basha Vara?</h2>
        <p className="text-gray-300 mb-6">We make your rental journey safe, easy, and effective.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">🔐 Secure Payments</h3>
            <p className="text-gray-400 mt-2">Transact with confidence using our encrypted platform.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">✔️ Verified Listings</h3>
            <p className="text-gray-400 mt-2">Only genuine properties from verified landlords.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">💬 Support & Chat</h3>
            <p className="text-gray-400 mt-2">Get help when you need it — we&apos;re always here.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-16 px-4 rounded-xl mx-2 text-center shadow-md">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">📧 Stay Updated!</h2>
        <p className="text-gray-300 mb-6">Subscribe to get rental tips, new listings, and exclusive offers directly to your inbox.</p>
        <form className="flex flex-col sm:flex-row items-center gap-4 w-[600px] mx-auto justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className=" flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 transition px-6 py-3 rounded-md text-white font-semibold"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default LandingExtraSections;
