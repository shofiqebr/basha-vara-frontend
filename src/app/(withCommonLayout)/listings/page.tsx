"use client";

import React, { useEffect, useState } from "react";

interface Listing {
  _id: string;
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  numberOfBedrooms: number;
  landlordId: string;
}

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const user = JSON.parse(loginData);
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/landlords/listings");
        const result = await res.json();
        // Filter listings by current landlord
        // const filtered = result.data.filter(
        //   (listing: Listing) => listing?.landlordId === userId
        // );
        setListings(result?.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">
      All Listings
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-400">No listings found for your account.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-yellow-300">
                {listing.title}
              </h2>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {listing.location}
              </p>
              <p>
                <span className="font-semibold">Rent:</span> ${listing.rentAmount}
              </p>
              <p>
                <span className="font-semibold">Bedrooms:</span> {listing.numberOfBedrooms}
              </p>
              <p className="mt-2 text-sm text-gray-300">{listing.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
