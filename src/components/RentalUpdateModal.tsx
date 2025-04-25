"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface RentalRequest {
  listingId: string;
  status: "pending" | "approved" | "rejected";
  additionalMessage?: string;
}

interface Props {
  request: RentalRequest;
  userId: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onUpdate: (updated: RentalRequest) => void;
}

const RentalUpdateModal = ({ request, userId, onClose, onUpdate }: Props) => {
  const [message, setMessage] = useState(request.additionalMessage || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/tenants/requests/${userId}/${request.listingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ additionalMessage: message }),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      toast.success("Request updated!");
      //   setReload((prev) => !prev);
      onUpdate(data.updatedRequest);
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[400px] text-white">
        <h3 className="text-xl font-bold mb-4">Update Rental Request</h3>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded mb-4"
          rows={4}
        ></textarea>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalUpdateModal;
function setReload(arg0: (prev: any) => boolean) {
  throw new Error("Function not implemented.");
}
