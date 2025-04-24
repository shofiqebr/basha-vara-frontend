"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// interface Listing {
//   _id: string;
//   title: string;
//   description: string;
//   rent: number;
// }

interface Listing {
  _id: string;
  rentAmount: number;
  description: string;
  images: string[];
  location?: string;
  numberOfBedrooms?: number;
}

interface RentalRequest {
  _id: string;
  tenantId: string;
  status: string;
  additionalMessage: string;
  landlordPhoneNumber?: string;
  listingId: string;
}

const LandlordDashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "requests">(
    "listings"
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [user, setUser] = useState<any[]>([]);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [status, setStatus] = useState<"approved" | "rejected">("approved");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal2, setShowModal2] = useState(false);

  const openModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowModal2(true);
  };
  console.log(selectedRequestId);

  const closeModal = () => {
    setShowModal2(false);
    setStatus("approved");
    setPhoneNumber("");
  };

  const handleSubmit = async () => {
    if (!selectedRequestId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/requests/৳{selectedRequestId}`,
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
      console.log(data);
      if (data.status) {
        alert("Request updated successfully");
        closeModal();
        // Optionally: refresh data
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
    const matched: any[] = [];

    user.forEach((user) => {
      if (user.rentalRequests && Array.isArray(user.rentalRequests)) {
        const matchedReqs = user.rentalRequests.filter(
          (req) => req.landlordId === userId
        );

        // Optional: Add user info with request if needed
        matchedReqs.forEach((req) => {
          matched.push({ ...req, tenantInfo: user });
        });
      }
    });

    setRequests(matched);
  }, [user, userId]);

  console.log(requests);

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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Listing>({
    _id: "",
    rentAmount: 0,
    description: "",
    images: [""],
  });

  useEffect(() => {
    if (userId) {
      if (activeTab === "listings") {
        fetch("http://localhost:5000/api/landlords/listings")
          .then((res) => res.json())
          .then((data) => setListings(data.data))
          .catch(() => toast.error("Failed to fetch listings"));
      } else if (activeTab === "requests") {
        fetch("http://localhost:5000/api/auth/users")
          .then((res) => res.json())
          .then((data) => {
            console.log(data?.data);
            setUser(data?.data);
            // const user = data?.data?.find((item) => item._id === userId);
            // setRequests(user?.rentalRequests || []);
          })
          .catch(() => toast.error("Failed to fetch rental requests"));
      }
    }
  }, [userId, activeTab]);

  // console.log(listings)

  const handleUpdate = (listingId: string) => {
    const selectedListing = listings.find((l) => l._id === listingId);
    if (selectedListing) {
      setEditData({
        _id: selectedListing._id,
        rentAmount: selectedListing.rentAmount,
        description: selectedListing.description,
        images: selectedListing.images ?? [""],
        location: selectedListing.location,
        numberOfBedrooms: selectedListing.numberOfBedrooms,
      });
      setShowModal(true);
    }
  };
  const handleEditSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/listings/৳{editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rentAmount: editData.rentAmount,
            description: editData.description,
            images: editData.images,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      const result = await res.json();
      console.log("Updated:", result);
      setShowModal(false);
      // TODO: Refresh listings after update
    } catch (err) {
      console.error("Error updating listing", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/listings/৳{id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete listing");
      toast.success("Listing deleted");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Landlord Panel</h2>

        <Link className="block w-full text-left mb-4" href={"/"}>
          <button className="w-full">🏠 Home</button>
        </Link>

        <button
          onClick={() => setActiveTab("listings")}
          className={`block w-full text-left px-2 py-1 rounded ৳{
            activeTab === "listings" ? "bg-gray-700 font-semibold" : ""
          }`}
        >
          📋 My Listings
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`block w-full text-left px-2 py-1 rounded ৳{
            activeTab === "requests" ? "bg-gray-700 font-semibold" : ""
          }`}
        >
          📨 Rental Requests
        </button>

        <button className="block w-full text-left px-2 py-1 rounded">
          ⚙️ Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "listings" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">My Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-gray-800 p-4 rounded shadow"
                >
                  {/* <h3 className="text-lg font-semibold">{listing.title}</h3> */}
                  <p>{listing.description}</p>
                  <p>{listing.location}</p>
                  <p>{listing.numberOfBedrooms} bedrooms</p>
                  <p>
                    <strong>Rent:</strong> {listing.rentAmount}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdate(listing._id)}
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white text-black rounded-lg p-6 w-96">
                    <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>

                    <label className="block mb-2 text-sm font-medium">
                      Rent Amount:
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={editData.rentAmount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            rentAmount: Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="block mb-2 text-sm font-medium">
                      Description:
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />
                    </label>

                    {/*  <label className="block mb-4 text-sm font-medium">
        Image URL:
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={editData.images[0]}
          onChange={(e) =>
            setEditData({ ...editData, images: [e.target.value] })
          }
        />
      </label> */}

                    <div>
                      <label className="block text-[#6B7280]">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 rounded bg-[#111827] text-white"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`Preview ৳{index}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handleEditSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Rental Requests</h2>
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req._id} className="bg-gray-800 p-4 rounded shadow">
                  <p>
                    <strong>Listing ID:</strong> {req.listingId}
                  </p>
                  <p>
                    <strong>Status:</strong> {req.status}
                  </p>
                  <p>
                    <strong>Message:</strong> {req.additionalMessage}
                  </p>
                  {req.status === "pending" && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => openModal(req._id)}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button className="bg-red-600 px-3 py-1 rounded">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
