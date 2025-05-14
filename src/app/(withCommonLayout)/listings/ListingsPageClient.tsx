// app/(withCommonLayout)/listings/ListingsPageClient.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the Listing interface
interface Listing {
  _id: string;
  images: string[];
  description: string;
  location: string;
  rentAmount: number;
  numberOfBedrooms: number;
  createdAt: string;
  category: string; // Added category
}

// Fetching function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ListingsPageClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search")?.toLowerCase() || "";
  const selectedCategory = searchParams.get("category")?.toLowerCase() || "";

  const { data, error, isLoading } = useSWR<{ data: Listing[] }>(
    "https://basha-vara-backend.vercel.app/api/landlords/listings",
    fetcher
  );

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Example static categories — can be fetched from backend if needed
  // Get unique categories dynamically from data
  const categories = [
    "All",
    ...Array.from(new Set(data?.data?.map((i) => i.category).filter(Boolean))),
  ];

  // Search by input
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (searchTerm) query.set("search", searchTerm);
    if (selectedCategory) query.set("category", selectedCategory);
    router.push(`/listings?${query.toString()}`);
  };

  // Category filter
  const handleCategoryClick = (category: string) => {
    const query = new URLSearchParams();
    if (category !== "All") query.set("category", category.toLowerCase());
    if (search) query.set("search", search);
    router.push(`/listings?${query.toString()}`);
  };

  useEffect(() => {
    if (!data?.data) return;

    let filtered = data.data;

    if (search) {
      filtered = filtered.filter((item) => {
        const matchesLocation = item.location.toLowerCase().includes(search);
        const matchesBedrooms = item.numberOfBedrooms
          .toString()
          .includes(search);
        const matchesRent = item.rentAmount.toString().includes(search);
        return matchesLocation || matchesBedrooms || matchesRent;
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === selectedCategory
      );
    }

    setFilteredListings(filtered);
  }, [data, searchParams]);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load listings</p>;

  const hasFilters = Boolean(search || selectedCategory);

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-center pt-5 gap-2 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search by location, price, or bedrooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[400px] p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-600 text-white py-2 px-6 rounded-md font-bold hover:bg-yellow-700 transition border border-gray-500"
        >
          Search
        </button>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex min-h-screen bg-gray-900 text-white p-6 mt-5">
        {/* Sidebar for Categories */}
        {/* Sidebar for Categories */}
        <div className="w-full md:w-1/5 md:pr-6 mb-6 md:mb-0">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">Categories</h2>
          <div className="space-y-3">
            {categories.map((cat) => {
              const isSelected =
                selectedCategory === cat.toLowerCase() ||
                (cat === "All" && !selectedCategory);

              return (
                <div
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center justify-between cursor-pointer rounded-lg px-4 py-3 transition-all duration-200 border ${
                    isSelected
                      ? "bg-yellow-600 text-white border-yellow-400 shadow-md"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="font-medium">{cat}</span>
                  {isSelected && (
                    <span className="text-xs bg-gray-900 px-2 py-0.5 rounded-md font-bold border border-yellow-300">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Listings Content */}
        <div className="w-4/5">
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
      </div>
    </>
  );
};

export default ListingsPageClient;
