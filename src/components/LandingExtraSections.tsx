"use client";

import React from "react";

import { motion } from 'framer-motion';

const steps = [
  {
    icon: '🔍',
    title: 'Search',
    description: 'Find listings by area, price, or category.',
  },
  {
    icon: '📩',
    title: 'Request',
    description: 'Submit rental requests directly to landlords.',
  },
  {
    icon: '💳',
    title: 'Pay',
    description: 'Use our secure payment system.',
  },
  {
    icon: '🚚',
    title: 'Move',
    description: "Get moving once you're approved!",
  },
];

const features = [
  {
    icon: '🔐',
    title: 'Secure Payments',
    description: 'Transact with confidence using our encrypted platform.',
  },
  {
    icon: '✔️',
    title: 'Verified Listings',
    description: 'Only genuine properties from verified landlords.',
  },
  {
    icon: '💬',
    title: 'Support & Chat',
    description: "Get help when you need it — we're always here.",
  },
  {
    icon: '⚡',
    title: 'Fast Approvals',
    description: 'Quick responses from landlords to speed up your process.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const LandingExtraSections = () => {
  return (
    <div className="space-y-14 px-2 py-10">
      {/* Offers Section */}
   <section className=" text-white py- px-4 mx-2 rounded-xl text-center shadow-md">
  <h2 className="text-3xl font-bold text-yellow-500 mb-4">
    🔥 Current Offers & Promotions
  </h2>
  <p className="text-gray-300 mb-6">
    Get discounts on your first month’s rent, festive season offers, and more!
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-yellow-400">📦 Relocation Bonus</h3>
      <p className="text-gray-400 mt-2">Free relocation support for tenants moving from another city.</p>
    </div>
  </div>
</section>


      {/* How It Works Section */}
      <section className=" text-white py- px-4 rounded-xl mx-2 text-center shadow-md">
      <h2 className="text-3xl font-bold text-yellow-500 mb-4">📌 How It Works</h2>
      <p className="text-gray-300 mb-10">Find and rent your perfect home in just a few easy steps.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <h4 className="text-xl font-semibold text-yellow-400 mb-2">{step.title}</h4>
            <p className="text-sm text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>

      {/* Why Choose Us Section */}
         <section className=" text-white py- px-4 rounded-xl mx-2 text-center shadow-md">
      <h2 className="text-3xl font-bold text-yellow-500 mb-4">🌟 Why Choose Basha Vara?</h2>
      <p className="text-gray-300 mb-10">We make your rental journey safe, easy, and effective.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>

      {/* Newsletter Section */}
      <section className=" text-white py-5 px-4 rounded-xl mx-2 text-center ">
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
