"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RentalUpdateModal from "@/components/RentalUpdateModal";



interface RentalRequest {
  listingId: string;
  status: "pending" | "approved" | "rejected";
  additionalMessage?: string;
}

const MyRentalRequests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
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
      fetch("http://localhost:5000/api/auth/users")
        .then((res) => res.json())
        .then((data) => {
          // console.log("Fetched users:", data?.data);
          setRequests(data?.data?.filter((item)=>item._id == userId));
        })
        .catch(() => toast.error("Failed to fetch rental requests"));
    }
  }, [userId]);


  console.log(requests)
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">My Rental Requests</h2>

      <div className="grid gap-4">
        {requests?.length === 0 ? (
          <p>No requests found</p>
        ) : (
          requests[0]?.rentalRequests?.map((req, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedRequest(req)}
            >
              <p><strong>Listing ID:</strong> {req?.listingId}</p>
              <p><strong>Status:</strong> {req?.status}</p>
              <p><strong>Message:</strong> {req?.additionalMessage || "N/A"}</p>
            </div>
          ))
        )}
      </div>

      {selectedRequest && (
        <RentalUpdateModal
          request={selectedRequest}
          userId={userId!}
          reload={reload} 
          setReload={setReload}
          onClose={() => setSelectedRequest(null)}
          onUpdate={(updated) => {
            setRequests((prev) =>
              prev.map((r) =>
                r.listingId === updated.listingId ? updated : r
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default MyRentalRequests;
