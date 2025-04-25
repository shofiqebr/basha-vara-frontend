"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

// Define the structure of a rental request
interface RentalRequest {
  status: string;
  additionalMessage?: string;
  landlordPhoneNumber?: string;
}

// Define the structure of the user object from the backend
interface User {
  _id: string;
  rentalRequests: RentalRequest[];
}

const TenantDashboard = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      try {
        const user = JSON.parse(loginData);
        setUserId(user._id);
      } catch (error) {
        console.error("Failed to parse loginData:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch("https://basha-vara-backend.vercel.app/api/auth/users")
        .then((res) => res.json())
        .then((data) => {
          const users: User[] = data?.data || [];
          const user = users.find((item) => item._id === userId);
          setRequests(user?.rentalRequests || []);
        })
        .catch(() => toast.error("Failed to fetch rental requests"));
    }
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Tenant Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">
            🏠 Home
          </Link>
          <Link
            href="/dashboard/tenant/profile"
            className="hover:bg-gray-700 p-2 rounded"
          >
            👤 Edit Profile
          </Link>
          <Link
            href="/dashboard/tenant/changePass"
            className="hover:bg-gray-700 p-2 rounded"
          >
            🔐 Change Password
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Your Rental Requests</h2>
        <ul className="space-y-4">
          {requests.map((req, i) => (
            <li key={i} className="bg-gray-800 p-4 rounded shadow">
              <p>
                <strong>Status:</strong> {req.status}
              </p>
              <p>
                <strong>Message:</strong> {req.additionalMessage || "N/A"}
              </p>
              {req.status === "approved" && (
                <>
                  <p>
                    <strong>Landlord Phone:</strong>{" "}
                    {req.landlordPhoneNumber || "N/A"}
                  </p>
                  <button className="mt-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded">
                    Pay Now
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TenantDashboard;
