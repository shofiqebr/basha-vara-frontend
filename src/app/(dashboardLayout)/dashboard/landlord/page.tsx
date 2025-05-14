/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Listing {
  _id: string;
  rentAmount: number;
  description: string;
  images: string[];
  location?: string;
  numberOfBedrooms?: number;
  createdAt: string;
}

interface TenantInfo {
  _id: string;
  name: string;
  email: string;
  rentalRequests?: RentalRequest[];
}

interface RentalRequest {
  landlordId: string | null;
  _id: string;
  tenantId: string;
  status: "pending" | "approved" | "rejected";
  additionalMessage: string;
  landlordPhoneNumber?: string;
  listingId: string;
  tenantInfo?: TenantInfo;
  createdAt: string;
}

const LandlordDashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "listings" | "requests"
  >("overview");
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [, setUsers] = useState<TenantInfo[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [status, setStatus] = useState<"approved" | "rejected">("approved");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeRequests: 0,
    approvedRequests: 0,
    totalEarnings: 0,
  });

  const [editData, setEditData] = useState<Listing>({
    _id: "",
    rentAmount: 0,
    description: "",
    images: [""],
    location: "",
    numberOfBedrooms: 0,
    createdAt: "",
  });

  const openModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowModal2(true);
  };

  const closeModal = () => {
    setShowModal2(false);
    setStatus("approved");
    setPhoneNumber("");
  };

  const handleSubmit = async () => {
    if (!selectedRequestId) return;

    try {
      const res = await fetch(
        `https://basha-vara-backend.vercel.app/api/landlords/requests/${selectedRequestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            phoneNumber: status === "approved" ? phoneNumber : undefined,
          }),
        }
      );

      const data = await res.json();
      if (data.status) {
        toast.success("Request updated successfully");
        closeModal();
        // Refresh requests
        fetchRequests();
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "basha-vara-app");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dal1rjdwl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
  };

  const handleUpdate = (listingId: string) => {
    const selectedListing = listings.find((l) => l._id === listingId);
    if (selectedListing) {
      setEditData({
        _id: selectedListing._id,
        rentAmount: selectedListing.rentAmount,
        description: selectedListing.description,
        images: selectedListing.images,
        location: selectedListing.location || "",
        numberOfBedrooms: selectedListing.numberOfBedrooms || 0,
        createdAt: selectedListing.createdAt,
      });
      setShowModal(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const imageUrls =
        selectedFiles.length > 0 ? await uploadImages() : editData.images;

      const res = await fetch(
        `https://basha-vara-backend.vercel.app/api/landlords/listings/${editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rentAmount: editData.rentAmount,
            description: editData.description,
            images: imageUrls,
            location: editData.location,
            numberOfBedrooms: editData.numberOfBedrooms,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      const result = await res.json();
      setShowModal(false);
      if (result?.data) {
        toast.success("Listing updated successfully");
        fetchListings();
      }
    } catch (err) {
      console.error("Error updating listing", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `https://basha-vara-backend.vercel.app/api/landlords/listings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete listing");

      toast.success("Listing deleted");
      setListings((prev) => prev.filter((l) => l._id !== id));
      // Update stats
      setStats((prev) => ({
        ...prev,
        totalListings: prev.totalListings - 1,
      }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(
        "https://basha-vara-backend.vercel.app/api/landlords/listings"
      );
      const data = await res.json();
      setListings(data.data || []);
      // Update stats
      setStats((prev) => ({
        ...prev,
        totalListings: data.data?.length || 0,
      }));
    } catch (error) {
      toast.error("Failed to fetch listings");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "https://basha-vara-backend.vercel.app/api/auth/users"
      );
      const data = await res.json();
      setUsers(data.data || []);

      // Calculate request stats
      const matched: RentalRequest[] = [];
      (data.data || []).forEach((user: TenantInfo) => {
        if (Array.isArray(user.rentalRequests)) {
          const matchedReqs = user.rentalRequests.filter(
            (req) => req.landlordId === userId
          );
          matchedReqs.forEach((req) => {
            matched.push({ ...req, tenantInfo: user });
          });
        }
      });

      setRequests(matched);
      // Update stats
      setStats((prev) => ({
        ...prev,
        activeRequests: matched.filter((r) => r.status === "pending").length,
        approvedRequests: matched.filter((r) => r.status === "approved").length,
      }));
    } catch (error) {
      toast.error("Failed to fetch rental requests");
    }
  };

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const user = JSON.parse(loginData);
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (activeTab === "listings") {
      fetchListings();
    } else if (activeTab === "requests") {
      fetchRequests();
    } else if (activeTab === "overview") {
      fetchListings();
      fetchRequests();
    }
  }, [userId, activeTab]);

  // Calculate total earnings (sum of rentAmount from approved requests' listings)
  useEffect(() => {
    if (requests.length > 0 && listings.length > 0) {
      const approvedListings = requests
        .filter((r) => r.status === "approved")
        .map((r) => listings.find((l) => l._id === r.listingId))
        .filter(Boolean) as Listing[];

      const total = approvedListings.reduce(
        (sum, listing) => sum + listing.rentAmount,
        0
      );

      setStats((prev) => ({
        ...prev,
        totalEarnings: total,
      }));
    }
  }, [requests, listings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 p-6 space-y-4 text-white">
        <h2 className="text-xl font-bold mb-6">Landlord Panel</h2>

        <Link className="block w-full text-left mb-4" href={"/"}>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-700 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>
        </Link>

        <button
          onClick={() => setActiveTab("overview")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            activeTab === "overview"
              ? "bg-indigo-600 font-semibold"
              : "hover:bg-indigo-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          Overview
        </button>

        <button
          onClick={() => setActiveTab("listings")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            activeTab === "listings"
              ? "bg-indigo-600 font-semibold"
              : "hover:bg-indigo-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm3 6a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          My Listings
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            activeTab === "requests"
              ? "bg-indigo-600 font-semibold"
              : "hover:bg-indigo-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            />
          </svg>
          Rental Requests
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "overview" ? (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-indigo-900">
              Dashboard Overview
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                <h3 className="text-gray-500 font-medium">Total Listings</h3>
                <p className="text-3xl font-bold mt-2 text-indigo-700">
                  {stats.totalListings}
                </p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>
                    {stats.totalListings > 0
                      ? `${stats.totalListings} active properties`
                      : "No listings yet"}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-gray-500 font-medium">Active Requests</h3>
                <p className="text-3xl font-bold mt-2 text-blue-700">
                  {stats.activeRequests}
                </p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Pending tenant applications</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 font-medium">Approved Requests</h3>
                <p className="text-3xl font-bold mt-2 text-green-700">
                  {stats.approvedRequests}
                </p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Successful rentals</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-gray-500 font-medium">Total Earnings</h3>
                <p className="text-3xl font-bold mt-2 text-purple-700">
                  ৳{stats.totalEarnings.toLocaleString()}
                </p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>From approved rentals</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Recent Listings
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {listings.slice(0, 3).map((listing) => (
                  <div key={listing._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-indigo-600">
                          {listing.location || "No location specified"}
                        </h4>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Added on {formatDate(listing.createdAt)} •{" "}
                            {listing.numberOfBedrooms || "N/A"} bedrooms • ৳
                            {listing.rentAmount}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpdate(listing._id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No listings found
                  </div>
                )}
              </div>
              {listings.length > 3 && (
                <div className="p-4 text-center border-t border-gray-200">
                  <button
                    onClick={() => setActiveTab("listings")}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View all listings
                  </button>
                </div>
              )}
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Recent Rental Requests
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {requests.slice(0, 3).map((req) => (
                  <div key={req._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-indigo-600">
                          Request for Listing: {req.listingId}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          {req.additionalMessage}
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              req.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)}
                          </span>
                          <span className="ml-3 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 inline mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <button
                          onClick={() => openModal(req._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No rental requests found
                  </div>
                )}
              </div>
              {requests.length > 3 && (
                <div className="p-4 text-center border-t border-gray-200">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View all requests
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "listings" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">
                My Listings
              </h2>
              <Link
                href="/add-listing"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Listing
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Bedrooms
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rent
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Added
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listings.map((listing) => (
                      <tr key={listing._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {listing.images[0] ? (
                                <Image
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={listing.images[0]}
                                  alt="Listing image"
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {listing.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {listing.location || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {listing.numberOfBedrooms || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ৳{listing.rentAmount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(listing.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUpdate(listing._id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(listing._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {listings.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No listings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Edit Listing
                  </h2>

                  {/* Rent Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rent Amount (৳)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editData.rentAmount}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          rentAmount: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Bedrooms */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Bedrooms
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editData.numberOfBedrooms}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          numberOfBedrooms: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Upload Images */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload New Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-1 text-sm"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Current Images */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Images
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editData.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded overflow-hidden border"
                        >
                          <Image
                            src={img}
                            alt={`Current ${index}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Image Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Image Previews
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded overflow-hidden border"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={handleEditSubmit}
                    >
                      Update
                    </button>
                  </div>

                  {/* Optional close (X) button */}
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">
                Rental Requests
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Showing {requests.length} request
                  {requests.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tenant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Listing ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Message
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indigo-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {req.tenantInfo?.name || "Unknown Tenant"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {req.tenantInfo?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {req.listingId.substring(0, 6)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {req.additionalMessage || "No message provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              req.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(req.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {req.status === "pending" ? (
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => {
                                  setStatus("approved");
                                  openModal(req._id);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setStatus("rejected");
                                  openModal(req._id);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setStatus(
                                  req.status as "approved" | "rejected"
                                );
                                openModal(req._id);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No rental requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {showModal2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded w-96">
              <h2 className="text-lg font-bold mb-4">
                Approve or Reject Rental Request
              </h2>

              <label>Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "approved" | "rejected")
                }
                className="w-full p-2 border rounded mb-3"
              >
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {status === "approved" && (
                <>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+8801..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                  />
                </>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
