"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RentalUpdateModal from "@/components/RentalUpdateModal";

interface RentalRequest {
  listingId: string;
  status: "pending" | "approved" | "rejected";
  additionalMessage?: string;
  moveInDate?: string;
  rentalDuration?: string;
  specialRequirements?: string;
}

interface UserData {
  _id: string;
  role: string;
  rentalRequests: RentalRequest[];
}

const MyRentalRequests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(
    null
  );
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const user = JSON.parse(loginData);
      setUserId(user._id);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    if (userRole && userRole !== "tenant") {
      toast.error("Access Denied: Tenants only");
      router.push("/");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (userId) {
      fetch("https://basha-vara-backend.vercel.app/api/auth/users")
        .then((res) => res.json())
        .then((data) => {
          const matchedUser = data?.data?.find(
            (item: UserData) => item._id === userId
          );
          setRequests(matchedUser || null);
        })
        .catch(() => toast.error("Failed to fetch rental requests"));
    }
  }, [userId, reload]);

  const sortedRequests = [...(requests?.rentalRequests || [])].reverse(); // Newest first

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        My Rental Requests
      </h2>

      <div className="grid gap-4">
        {sortedRequests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          sortedRequests.map((req, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 cursor-pointer"
            >
              <p>
                <strong>Listing ID:</strong> {req?.listingId}
              </p>
              <p>
                <strong>Status:</strong> {req?.status}
              </p>
              <p>
                <strong>Message:</strong> {req?.additionalMessage || "N/A"}
              </p>
              <p>
                <strong>Move in Date:</strong> {req?.moveInDate || "N/A"}
              </p>
              <p>
                <strong>Duration:</strong> {req?.rentalDuration || "N/A"}
              </p>
              <p>
                <strong>Special Requirements:</strong>{" "}
                {req?.specialRequirements || "N/A"}
              </p>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRequest && userId && (
        <RentalUpdateModal
          request={selectedRequest}
          userId={userId}
          reload={reload}
          setReload={setReload}
          onClose={() => setSelectedRequest(null)}
          onUpdate={(updated) => {
            setRequests((prev) => {
              if (!prev) return prev;
              const updatedRequests = prev.rentalRequests.map((r) =>
                r.listingId === updated.listingId ? updated : r
              );
              return { ...prev, rentalRequests: updatedRequests };
            });
          }}
        />
      )}
    </div>
  );
};

export default MyRentalRequests;
