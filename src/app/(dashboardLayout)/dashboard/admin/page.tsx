/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import Link from "next/link";

type ViewType = "overview" | "users" | "listings" | "profile";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "landlord" | "tenant";
  isActive: boolean;
};

type Listing = {
  _id: string;
  location: string;
  description: string;
  rentAmount: number;
  numberOfBedrooms?: number;
};

type FormDataType = {
  location: string;
  description: string;
  rentAmount: string;
  numberOfBedrooms: string;
};

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    location: "",
    description: "",
    rentAmount: "",
    numberOfBedrooms: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(
          "https://basha-vara-backend.vercel.app/api/admin/users"
        );
        const userData = await userRes.json();
        setUsers(userData.data);
      } catch {
        toast.error("Failed to fetch users");
      }

      try {
        const listingRes = await fetch(
          "https://basha-vara-backend.vercel.app/api/admin/listings"
        );
        const listingData = await listingRes.json();
        setListings(listingData.data);
      } catch {
        toast.error("Failed to fetch listings");
      }
    };

    fetchData();
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(
          `https://basha-vara-backend.vercel.app/api/admin/users/${id}`,
          {
            method: "DELETE",
          }
        );
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u._id !== id));
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      location: listing.location || "",
      description: listing.description || "",
      rentAmount: listing.rentAmount?.toString() || "",
      numberOfBedrooms: listing.numberOfBedrooms?.toString() || "",
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
    if (!editingListing) return;

    try {
      const res = await fetch(
        `https://basha-vara-backend.vercel.app/api/admin/listings/${editingListing._id}`,
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
        const updated = listings.map((l) =>
          l._id === editingListing._id ? { ...l, ...result.data } : l
        );
        setListings(updated);
        setEditingListing(null);
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch {
      toast.error("Error updating listing");
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      const res = await fetch(
        `https://basha-vara-backend.vercel.app/api/admin/listings/${id}`,
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
    } catch {
      toast.error("Error deleting listing");
    }
  };

  const renderOverview = () => {
    const totalUsers = users.length;
    const totalListings = listings.length;
    const activeUsers = users.filter((user) => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    return (
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold mb-4">Total Users</h3>
            <p className="text-4xl">{totalUsers}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold mb-4">Active Users</h3>
            <p className="text-4xl">{activeUsers}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold mb-4">Inactive Users</h3>
            <p className="text-4xl">{inactiveUsers}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold mb-4">Total Listings</h3>
            <p className="text-4xl">{totalListings}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderUsers = () => {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <table className="min-w-full bg-gray-800 text-white rounded-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-start">Name</th>
              <th className="px-6 py-3 text-start">Email</th>
              <th className="px-6 py-3 text-start">Role</th>
              <th className="px-6 py-3 text-start">Status</th>
              <th className="px-6 py-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-gray-800 hover:bg-gray-700">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  const renderListings = () => {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Rental Listings</h2>
        <table className="min-w-full bg-gray-800 text-white rounded-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-start">Location</th>
              <th className="px-6 py-3 text-start">Description</th>
              <th className="px-6 py-3 text-start">Rent</th>
              <th className="px-6 py-3 text-start">Bedrooms</th>
              <th className="px-6 py-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="bg-gray-800 hover:bg-gray-700">
                <td className="px-6 py-4">{listing.location}</td>
                <td className="px-6 py-4">{listing.description}</td>
                <td className="px-6 py-4">৳{listing.rentAmount}</td>
                <td className="px-6 py-4">{listing.numberOfBedrooms}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEditClick(listing)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  const renderProfile = () => {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
        {editingUser ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <p>
              <strong>Name:</strong> {editingUser.name}
            </p>
            <p>
              <strong>Email:</strong> {editingUser.email}
            </p>
            <p>
              <strong>Role:</strong> {editingUser.role}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {editingUser.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        ) : (
          <p>Select a user to view their profile details</p>
        )}
      </section>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return renderOverview();
      case "users":
        return renderUsers();
      case "listings":
        return renderListings();
      case "profile":
        return renderProfile();
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">
            🏠 Home
          </Link>
          <button
            className={classNames("text-left hover:bg-gray-700 p-2 rounded", {
              "bg-gray-700": activeView === "overview",
            })}
            onClick={() => setActiveView("overview")}
          >
            📊 Overview
          </button>
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

      <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
