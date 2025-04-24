"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import Link from "next/link";

type ViewType = "users" | "listings" | "profile";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>("users");
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch all users
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.data))
      .catch(() => toast.error("Failed to fetch users"));

    // Fetch all listings
    fetch("http://localhost:5000/api/landlords/listings")
      .then((res) => res.json())
      .then((data) => setListings(data.data))
      .catch(() => toast.error("Failed to fetch listings"));
  }, []);

  console.log(listings);

  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    rentAmount: "",
  });

  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setFormData({
      location: listing.location || "",
      description: listing.description || "",
      rentAmount: listing.rentAmount?.toString() || "",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/listings/${editingListing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: formData.location,
            description: formData.description,
            rentAmount: Number(formData.rentAmount),
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success("Listing updated!");
        setEditingListing(null);
        // Update listings in UI
        const updated = listings.map((l) =>
          l._id === editingListing._id ? { ...l, ...result.data } : l
        );
        setListings(updated);
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating listing");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/listings/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success("Listing deleted!");
        setListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("Error deleting listing");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/landlords/listings/৳{id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rentAmount: 27000,
            description: "Updated description with new features",
            location: "telavbo",
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success("Listing updated!");
        // Re-fetch listings or manually update state
        const updated = listings.map((l) =>
          l._id === id ? { ...l, ...result.data } : l
        );
        setListings(updated);
      } else {
        toast.error(result.message || "Failed to update listing");
      }
    } catch (error) {
      toast.error("Error updating listing");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <ul className="space-y-4">
              {users.map((user, i) => (
                <li key={i} className="bg-gray-800 p-4 rounded shadow">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      case "listings":
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Rental Listings</h2>
            <ul className="space-y-4">
              {listings.map((listing, i) => (
                <li
                  key={i}
                  className="bg-gray-800 p-4 rounded shadow space-y-2"
                >
                  <p>
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {listing.description}
                  </p>
                  <p>
                    <strong>Bedrooms:</strong> {listing.numberOfBedrooms}
                  </p>
                  <p>
                    <strong>Rent:</strong> ৳{listing.rentAmount}
                  </p>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditClick(listing)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      ✏️ Update
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Update Form Modal */}
            {editingListing && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-white text-black p-6 rounded-lg w-full max-w-md space-y-4"
                >
                  <h3 className="text-xl font-bold mb-2">Edit Listing</h3>

                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Location"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Description"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <input
                    name="rentAmount"
                    type="number"
                    value={formData.rentAmount}
                    onChange={handleFormChange}
                    placeholder="Rent Amount"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingListing(null)}
                      className="bg-gray-400 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        );

      case "profile":
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
            <p>This is where you can show and update admin profile info.</p>
          </section>
        );
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">
            🏠 Home
          </Link>
          <button
            className={classNames("text-left hover:bg-gray-700 p-2 rounded", {
              "bg-gray-700": activeView === "users",
            })}
            onClick={() => setActiveView("users")}
          >
            👥 Manage Users
          </button>
          <button
            className={classNames("text-left hover:bg-gray-700 p-2 rounded", {
              "bg-gray-700": activeView === "listings",
            })}
            onClick={() => setActiveView("listings")}
          >
            🏠 Manage Listings
          </button>
          <button
            className={classNames("text-left hover:bg-gray-700 p-2 rounded", {
              "bg-gray-700": activeView === "profile",
            })}
            onClick={() => setActiveView("profile")}
          >
            👤 Admin Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("loginData");
              window.location.href = "/";
            }}
            className="text-left hover:bg-gray-700 p-2 rounded text-red-400"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
