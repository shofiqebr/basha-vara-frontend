"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const ListingDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loginData, setLoginData] = useState("");
  const params = useParams();
  const _id = params?._id as string;

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      setLoginData(parsedData);
    }
  }, []);
  // console.log(loginData)

  interface Listing {
    id: string;
    images: string[];
    description: string;
    location: string;
    rentAmount: number;
    numberOfBedrooms: number;
  }

  // SWR fetcher function
  const fetcher = (url: string): Promise<{ data: Listing[] }> =>
    fetch(url, { cache: "no-store" }).then((res) => res.json());

  // Fetch listings using SWR
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/api/landlords/listings",
    fetcher,
    { refreshInterval: 5000 } // Re-fetch every 5 seconds
  );

  // State hooks should always be at the top
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalRequest, setRentalRequest] = useState<RentalRequest>({
    moveInDate: "",
    duration: "",
    specialRequirements: "",
  });

  // console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading listing.</div>;

  // Find the specific listing by _id
  const item = data?.data?.find((listing) => listing._id === _id);
  // console.log(item)

  if (!item) return <div>Listing not found.</div>;

  const handleSubmitRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tenants/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId: item._id,
            tenantId: loginData?._id,
            status: "pending",
            additionalMessage: `
            Move-in Date: ৳{rentalRequest.moveInDate},
            Duration: ৳{rentalRequest.duration},
            Notes: ৳{rentalRequest.specialRequirements}
          `,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Rental request submitted successfully!");
      setIsModalOpen(false);
      setRentalRequest({
        moveInDate: "",
        duration: "",
        specialRequirements: "",
      });
    } catch (error) {
      console.error("Error submitting rental request:", error);
      alert("Failed to submit rental request.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="bg-gray-800 shadow-lg p-6 rounded-lg text-white border-2 border-yellow-700 flex flex-col items-center w-[1200px] relative">
        {/* Image Section */}
        {/* Image Slider Section */}
        {item.images.length > 1 ? (
          <div className="w-[1000px] h-[400px] overflow-hidden rounded-lg relative">
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? item?.images.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-10"
            >
              ‹
            </button>

            <Image
              src={item?.images[currentImageIndex]}
              alt="House"
              width={1000}
              height={400}
              className="rounded-md w-full h-full object-cover"
            />

            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === item.images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-10"
            >
              ›
            </button>
          </div>
        ) : (
          <div className="w-[1000px] h-[400px] overflow-hidden rounded-lg">
            <Image
              src={item.images[0] ?? "/placeholder.jpg"}
              alt="House"
              width={1000}
              height={400}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
        )}

        {/* House Info */}
        <h2 className="text-xl font-semibold mt-3 text-yellow-500">
          {item.description}
        </h2>
        <p className="text-gray-300">📍 {item.location}</p>
        <p className="text-white font-bold text-lg">
          💰 {item.rentAmount} / month
        </p>
        <p className="text-gray-300">🛏️ {item.numberOfBedrooms} Bedrooms</p>
        <p className="text-gray-300">🏡 Amenities: {item.amenities}</p>

        {/* Rental Request Button */}
        <button
          onClick={() => {
            if (loginData?.role === "tenant") {
              setIsModalOpen(true);
            } else {
              alert("Only tenants can request rentals.");
            }
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 mt-4 rounded-md transition"
        >
          Request Rental
        </button>

        {/* Rental Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg text-white w-1/3">
              <h3 className="text-yellow-500 text-xl font-semibold mb-4">
                Rental Request
              </h3>

              <input
                type="date"
                value={rentalRequest.moveInDate}
                onChange={(e) =>
                  setRentalRequest({
                    ...rentalRequest,
                    moveInDate: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white mt-2"
                placeholder="Move-in Date"
              />

              <input
                type="text"
                value={rentalRequest.duration}
                onChange={(e) =>
                  setRentalRequest({
                    ...rentalRequest,
                    duration: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white mt-2"
                placeholder="Rental Duration (e.g., 6 months)"
              />

              <textarea
                value={rentalRequest.specialRequirements}
                onChange={(e) =>
                  setRentalRequest({
                    ...rentalRequest,
                    specialRequirements: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white mt-2"
                placeholder="Special Requirements"
              />

              <button
                onClick={handleSubmitRequest}
                className="bg-yellow-600 hover:bg-yellow-700 w-full mt-4 py-2 px-4 rounded-md"
              >
                Submit Request
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 w-full mt-2 py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
