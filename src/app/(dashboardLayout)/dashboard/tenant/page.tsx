"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

interface RentalRequest {
  status: string;
  additionalMessage?: string;
  landlordPhoneNumber?: string;
  propertyId?: string;
  createdAt?: string;
}

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

  // Calculate stats for the overview cards
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(
    (req) => req.status === "approved"
  ).length;
  const pendingRequests = requests.filter(
    (req) => req.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="fixed w-64 bg-indigo-800 text-white h-full p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-8">Tenant Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Link
            href="/"
            className="hover:bg-indigo-700 p-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/tenant/profile"
            className="hover:bg-indigo-700 p-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>👤</span>
            <span>Edit Profile</span>
          </Link>
          <Link
            href="/dashboard/tenant/changePass"
            className="hover:bg-indigo-700 p-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>🔐</span>
            <span>Change Password</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">
          Dashboard Overview
        </h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 font-medium">Total Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{totalRequests}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 font-medium">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {approvedRequests}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 font-medium">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingRequests}
            </p>
          </div>
        </div>

        {/* Rental Requests Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-indigo-900">
              Your Rental Requests
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landlord Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((req, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : req.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.propertyId || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {req.additionalMessage || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.landlordPhoneNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {req.status === "approved" && (
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm transition-colors">
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No rental requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
