"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";

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

  // State for combined search input
  const [searchTerm, setSearchTerm] = useState("");

  // Unified search logic
  const handleSearch = () => {
    router.push(`/listings?search=${searchTerm}`);
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

  // if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  // console.log(data)

  return (
    <section className="bg-background pt-8 px-6 text-center text-white min-h-screen">
      <div className="container mx-auto">
        {/* Navbar-like Search + Post Section */}
        <div className="px-6 py- flex flex-col md:flex-row items-center justify-center rounded-md mb-10 ">
          {/* Search Bar */}
          <div className=" flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by location, price, or bedrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[400px] p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-yellow-600 text-white py-2 px-6 rounded-md font-bold hover:bg-yellow-700 transition border border-gray-500"
            >
              Search
            </button>
          </div>

          {/* Post Rental CTA Button */}
          <div className="relative group">
            <button
              onClick={() => {
                if (userRole !== "landlord") {
                  toast.info("Only landlords can post rental information.");
                  return;
                }
                router.push("/post-rental");
              }}
              disabled={userRole !== "landlord"}
              className={`ml-0 md:ml-2 bg-yellow-600 text-white py-2 px-6 rounded-md border border-gray-500 transition ${
                userRole !== "landlord"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-700"
              }`}
            >
              Add Rental Info
            </button>

            {userRole !== "landlord" && (
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white bg-gray-700 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Only landlords can add rentals
              </span>
            )}
          </div>
        </div>
        <div
          className="text-white py-16 px-4 md:px-8 lg:px-16 rounded-xl relative overflow-hidden"
          style={{
            backgroundColor: "#111827",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' fill='%23D97706' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-opacity='0.05' d='M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z'/%3E%3C/svg%3E")`,
          }}
        >
          <div className="relative z-10 mx-auto grid md:grid-cols-2 gap-10 items-center">
            {/* Hero Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-6 leading-tight">
                Find Your Perfect Rental House Today!
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Explore the best rental houses in your desired location. Fast,
                simple, and secure — only on Basha Vara.
              </p>
              <Link href="/listings">
                <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 transition px-6 py-3 rounded-lg text-white font-semibold">
                  Browse All Listings
                </button>
              </Link>
            </div>

            {/* Carousel */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <Carousel
                autoPlay
                infiniteLoop
                interval={4000}
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                swipeable
                emulateTouch
                className="rounded-lg"
              >
                <div>
                  <img
                    src="https://res.cloudinary.com/dal1rjdwl/image/upload/v1745546104/mt4sswfa7uo2yyhohhdj.jpg"
                    alt="Rental House 1"
                    className="h-[400px] w-full object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://res.cloudinary.com/dal1rjdwl/image/upload/v1744253229/cxwtjsmebew9drwcc8mp.jpg"
                    alt="Rental House 2"
                    className="h-[400px] w-full object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://res.cloudinary.com/dal1rjdwl/image/upload/v1744253791/lwbvfxxzazl9vqwb3o41.jpg"
                    alt="Rental House 3"
                    className="h-[400px] w-full object-cover"
                  />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      {/* Rental House Cards */}
      <div className="container mx-auto mt-  pt-10 px-">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">
          Latest Listings
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          See the latest Listings here with facilities
        </p>

        {/* Rental House Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 animate-pulse shadow-lg border border-gray-700 rounded-2xl overflow-hidden text-white"
                >
                  <div className="w-full h-56 bg-gray-700"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-700 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))
            : visibleListings.map((item, index) => (
                <div
                  onClick={() => router.push(`/${item?._id}`)}
                  key={index}
                  className="bg-gray-800 shadow-lg border border-gray-700 rounded-2xl overflow-hidden text-white transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={item.images[0] || "/placeholder.jpg"}
                      alt="House"
                      fill
                      className="object-cover rounded-t-2xl"
                      priority
                    />
                  </div>
                  <div className="p-5 flex flex-col">
                    <h2 className="text-2xl font-semibold text-yellow-400 whitespace-nowrap overflow-hidden text-ellipsis">
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
                    <button className="bg-yellow-500 text-white py-2 px-6 mt-4 rounded-lg border border-gray-500 hover:bg-yellow-600 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Show All Button */}
        {(data?.data?.length ?? 0) > 8 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => router.push("/listings")}
              className="bg-yellow-500 text-white py-2 px-8 rounded-lg border border-gray-500 hover:bg-yellow-600 transition"
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
