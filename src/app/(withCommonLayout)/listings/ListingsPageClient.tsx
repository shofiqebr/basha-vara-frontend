// app/(withCommonLayout)/listings/ListingsPageClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define the Listing interface
interface Listing {
  _id: string;
  images: string[];
  description: string;
  location: string;
  rentAmount: number;
  numberOfBedrooms: number;
  createdAt: string;
}

// Fetching function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingsPageClient = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const { data, error, isLoading } = useSWR<{ data: Listing[] }>(
    "http://localhost:5000/api/landlords/listings",
    fetcher
  );

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

   const router = useRouter();
    // Unified search logic
  const handleSearch = () => {
    router.push(`/listings?search=${searchTerm}`);
  };

  useEffect(() => {
    if (!data?.data) return;

    if (!search) {
      setFilteredListings(data.data);
      return;
    }

    const filtered = data.data.filter((item) => {
      const matchesLocation = item.location.toLowerCase().includes(search);
      const matchesBedrooms = item.numberOfBedrooms.toString().includes(search);
      const matchesRent = item.rentAmount.toString().includes(search);

      return matchesLocation || matchesBedrooms || matchesRent;
    });

    setFilteredListings(filtered);
  }, [data, search]);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load listings</p>;

  const hasFilters = Boolean(search);

  return (
    <>

      {/* Search Bar */}
          <div className=" flex justify-center pt-5 gap-2 w-full md:w-auto">
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
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-5">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        {hasFilters ? "Filtered Listings" : "All Listings"}
      </h1>

      {filteredListings.length === 0 ? (
        <p className="text-gray-400">No listings match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item._id}
              className="bg-[#1F2937] rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.images[0] || "/placeholder.jpg"}
                  alt="House"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-yellow-500 mb-1">
                  {item.description.slice(0, 40)}...
                </h2>
                <p className="text-gray-300">{item.location}</p>
                <p className="text-white font-bold mt-2">
                  ৳{item.rentAmount} / month
                </p>
                <p className="text-sm text-gray-400">
                  🛏️ {item.numberOfBedrooms} Bedrooms
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ListingsPageClient;
