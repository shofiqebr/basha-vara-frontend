"use client";

import React from "react";

const ExtraSections = () => {
  return (
    <div className="bg-gray-900 text-white py-16 px-6 mx-8 space-y-24 rounded-xl">
      {/* Testimonials Section */}
      <section className="border-b border-gray-700 pb-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">🌟 Success Stories</h2>
        <p className="text-gray-300 mb-6">
          Hear from our users who found their dream rentals with BashaFinder.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ name: "Rahim Ahmed", text: "Found the perfect apartment in just two days. Amazing experience!" },
            { name: "Sara Jahan", text: "BashaFinder made my house search stress-free and smooth." },
            { name: "Arman Hossain", text: "Highly recommended! The listings are accurate and reliable." }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 italic">{testimonial.text}</p>
              <h3 className="text-xl font-semibold text-yellow-400 mt-4">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">💡 Rental Tips & Advice</h2>
        <p className="text-gray-300 mb-6">
          Follow these expert tips to make your rental search successful.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ title: "Check the Neighborhood", text: "Visit the area at different times of the day to get a feel for the surroundings." },
            { title: "Understand the Lease Terms", text: "Read the contract carefully and clarify any doubts before signing." },
            { title: "Compare Listings", text: "Don't rush! Compare multiple listings to find the best value for your budget." }
          ].map((tip, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">{tip.title}</h3>
              <p className="text-gray-400">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExtraSections;
