"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";
import Image from "next/image";

interface Listing {
  _id: string;
  images: string[];
  description: string;
  location: string;
  rentAmount: number;
  numberOfBedrooms: number;
  createdAt: string;
}

const HeroSection = () => {
  const router = useRouter();

  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);

  // State for search parameters
  const [searchParams, setSearchParams] = useState<{
    location: string;
    price: string;
    bedrooms: string;
  }>({
    location: "",
    price: "",
    bedrooms: "",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle search button click
  const handleSearch = () => {
    router.push(
      `/listings?location=${searchParams.location}&price=${searchParams.price}&bedrooms=${searchParams.bedrooms}`
    );
  };

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      setUserRole(parsedData.role); // Ensure loginData contains "role"
    }
  }, []);

  // SWR fetcher function
  const fetcher = (url: string): Promise<{ data: Listing[] }> =>
    fetch(url, { cache: "no-store" }).then((res) => res.json());

  // Fetch listings using SWR
  const { data, error, isLoading } = useSWR(
    "https://basha-vara-backend.vercel.app/api/landlords/listings",
    fetcher,
    { refreshInterval: 5000 } // Re-fetch every 5 seconds
  );

  useEffect(() => {
    if (data?.data) {
      const sorted = [...data.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setVisibleListings(sorted.slice(0, 6));
    }
  }, [data]);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  // console.log(data)

  return (
    <section className="bg-background py-16 px-6 text-center text-white min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Find Your Perfect Rental House Today!
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Explore the best rental houses in your desired location.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center relative group">
          <button
            onClick={() => {
              if (userRole !== "landlord") {
                toast.info("Only landlords can post rental information.");
                return;
              }
              router.push("/post-rental");
            }}
            disabled={userRole !== "landlord"}
            className={`bg-accent text-white py-2 px-6 rounded-md border border-gray-500 transition ${
              userRole !== "landlord"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-700"
            }`}
          >
            Post Rental House Info
          </button>

          {/* Tooltip below the button */}
          {userRole !== "landlord" && (
            <span className="absolute -bottom-8 text-sm text-white bg-gray-700 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Only landlords can post rentals
            </span>
          )}
        </div>

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
            <option value="low">Below ৳5000</option>
            <option value="medium">৳5000 - ৳20000</option>
            <option value="high">Above ৳20001</option>
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
      <div className="container mx-auto mt-12">
        {/* Rental House Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleListings.map((item, index) => (
            <div
              onClick={() => router.push(`/${item?._id}`)}
              key={index}
              className="bg-[#1F2937] shadow-lg border border-gray-600 rounded-2xl overflow-hidden text-white transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full h-80">
                <Image
                  src={item.images[0] || "/placeholder.jpg"} // fallback in case image is missing
                  alt="House"
                  fill
                  className="object-cover rounded-t-2xl"
                  priority // optional for better LCP
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col">
                <h2 className="text-2xl font-semibold text-[#D97706] whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.description.length > 30
                    ? item.description.slice(0, 30) + "..."
                    : item.description}
                </h2>
                <p className="text-gray-300 mt-1">{item.location}</p>
                <p className="text-white font-bold text-lg mt-1">
                  ৳ {item.rentAmount} / month
                </p>
                <p className="text-gray-400 text-sm">
                  🛏️ {item.numberOfBedrooms} Bedrooms
                </p>

                <button className="bg-[#D97706] text-white py-2 px-6 mt-4 rounded-lg border border-gray-500 hover:bg-yellow-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show All Button */}
        {(data?.data?.length ?? 0) > 6 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => router.push("/listings")}
              className="bg-[#D97706] text-white py-2 px-8 rounded-lg border border-gray-500 hover:bg-yellow-700 transition"
            >
              Show All Listings
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
