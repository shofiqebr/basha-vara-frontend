"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import houseImg from "../../public/house.jpg";

const HeroSection = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: "",
    price: "",
    bedrooms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    router.push(`/listings?location=${searchParams.location}&price=${searchParams.price}&bedrooms=${searchParams.bedrooms}`);
  };

  return (
    <section className="bg-background py-16 px-6 text-center text-white">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Rental House Today!</h1>
        <p className="text-lg text-gray-300 mb-6">Explore the best rental houses in your desired location.</p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/post-rental")}
          className="bg-accent text-white py-2 px-6 rounded-md border border-gray-500 hover:bg-yellow-700 transition"
        >
          Post Rental House Info
        </button>

        {/* Search Bar */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <input
            type="text"
            name="location"
            placeholder="Enter Location"
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-500 bg-gray-800 text-white placeholder-gray-400"
          />
          <select
            name="price"
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-500 bg-gray-800 text-white"
          >
            <option value="">Select Price Range</option>
            <option value="low">Below $500</option>
            <option value="medium">$500 - $1000</option>
            <option value="high">Above $1000</option>
          </select>
          <select
            name="bedrooms"
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-500 bg-gray-800 text-white"
          >
            <option value="">Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3+</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-gray-900 transition border border-gray-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* Rental House Cards */}
      <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-gray-800 shadow-lg p-4 rounded-lg text-white flex flex-col items-center border-2">
            <Image src={houseImg} alt="House" width={300} height={200} className="rounded-md" />
            <h2 className="text-xl font-semibold mt-3">Beautiful Apartment in City Center</h2>
            <p className="text-gray-300">Location: Dhaka, Bangladesh</p>
            <p className="text-white font-bold">$800 / month</p>
            <p className="text-gray-300">Bedrooms: 3</p>
            <button
              onClick={() => router.push(`/listing/${id}`)}
              className="bg-accent text-white py-2 px-4 mt-4 rounded-md border hover:bg-yellow-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
