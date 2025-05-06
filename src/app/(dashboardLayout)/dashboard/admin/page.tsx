"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import Link from "next/link";

type ViewType = "users" | "listings" | "profile";

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
  const [activeView, setActiveView] = useState<ViewType>("users");
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

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="bg-gray-800 p-4 rounded shadow space-y-1"
                >
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Modal for editing user */}
            {showModal && editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white text-black p-6 rounded-md w-96">
                  <h3 className="text-xl font-bold mb-4">Edit User</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const updatedUser = {
                        name: editingUser.name,
                        email: editingUser.email,
                        role: editingUser.role,
                        isActive: editingUser.isActive,
                      };
                      try {
                        const res = await fetch(
                          `https://basha-vara-backend.vercel.app/api/admin/users/${editingUser._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updatedUser),
                          }
                        );
                        if (res.ok) {
                          toast.success("User updated");
                          setUsers((prev) =>
                            prev.map((u) =>
                              u._id === editingUser._id
                                ? { ...u, ...updatedUser }
                                : u
                            )
                          );
                          setShowModal(false);
                        } else {
                          toast.error("Update failed");
                        }
                      } catch {
                        toast.error("Update error");
                      }
                    }}
                  >
                    <input
                      type="text"
                      className="w-full mb-2 p-2 border rounded"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      className="w-full mb-2 p-2 border rounded"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                    <select
                      className="w-full mb-2 p-2 border rounded"
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as User["role"],
                        })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="landlord">Landlord</option>
                      <option value="tenant">Tenant</option>
                    </select>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editingUser.isActive}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      Active
                    </label>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="bg-gray-400 text-black px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        );

      case "listings":
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Rental Listings</h2>
            <ul className="space-y-4">
              {listings.map((listing) => (
                <li
                  key={listing._id}
                  className="bg-gray-800 p-4 rounded shadow space-y-2"
                >
                  <p>
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {listing.description}
                  </p>
                  <p>
                    <strong>Bedrooms:</strong>{" "}
                    {listing.numberOfBedrooms || "N/A"}
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
                      onClick={() => handleDeleteListing(listing._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

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
                    className="w-full p-2 border rounded"
                    required
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    name="numberOfBedrooms"
                    type="number"
                    value={formData.numberOfBedrooms}
                    onChange={handleFormChange}
                    placeholder="Number of Bedrooms"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <input
                    name="rentAmount"
                    type="number"
                    value={formData.rentAmount}
                    onChange={handleFormChange}
                    placeholder="Rent Amount"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <div className="flex justify-end gap-2">
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
            <p>Admin information</p>
          </section>
        );

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
