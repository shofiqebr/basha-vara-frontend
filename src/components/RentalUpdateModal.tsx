/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface RentalRequest {
  listingId: string;
  status: "pending" | "approved" | "rejected";
  additionalMessage?: string;
  moveInDate?: string;
  rentalDuration?: string;
  specialRequirements?: string;
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
  const [moveInDate, setMoveInDate] = useState(request.moveInDate || "");
  const [rentalDuration, setRentalDuration] = useState(
    request.rentalDuration || ""
  );
  const [specialRequirements, setSpecialRequirements] = useState(
    request.specialRequirements || ""
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/tenants/requests/${userId}/${request.listingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            additionalMessage: message,
            moveInDate,
            rentalDuration,
            specialRequirements,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      toast.success("Request updated!");
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

        <label className="block mb-2">Move-in Date</label>
        <input
          type="date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded"
        />

        <label className="block mb-2">Rental Duration</label>
        <input
          type="text"
          value={rentalDuration}
          onChange={(e) => setRentalDuration(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          placeholder="e.g., 6 months"
        />

        <label className="block mb-2">Special Requirements</label>
        <textarea
          value={specialRequirements}
          onChange={(e) => setSpecialRequirements(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded mb-4"
          rows={2}
        ></textarea>

        <label className="block mb-2">Additional Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded mb-4"
          rows={2}
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
