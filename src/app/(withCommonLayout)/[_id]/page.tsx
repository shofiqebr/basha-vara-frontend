/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

// Interfaces
interface RentalRequest {
  moveInDate: string;
  duration: string;
  specialRequirements: string;
}

interface Listing {
  [x: string]: any;
  _id: string;
  images: string[];
  description: string;
  location: string;
  rentAmount: number;
  numberOfBedrooms: number;
  amenities?: string;
  catefory?: string;
}

interface LoginData {
  _id: string;
  role: string;
}

const ListingDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalRequest, setRentalRequest] = useState<RentalRequest>({
    moveInDate: "",
    duration: "",
    specialRequirements: "",
  });

  const params = useParams();
  const _id = params?._id as string;

  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (stored) {
      try {
        const parsed: LoginData = JSON.parse(stored);
        setLoginData(parsed);
      } catch (err) {
        console.error("Invalid loginData in localStorage");
      }
    }
  }, []);

  const fetcher = (url: string): Promise<{ data: Listing[] }> =>
    fetch(url, { cache: "no-store" }).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://basha-vara-backend.vercel.app/api/landlords/listings",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading listing.</div>;

  const item = data?.data?.find((listing) => listing._id === _id);
  console.log(item, data);

  if (!item)
    return (
      <div className="min-h-[600px] flex items-center justify-center text-white text-xl">
        Listing not found.
      </div>
    );

  const handleSubmitRequest = async () => {
    if (!loginData) {
      toast.error("You must be logged in to request a rental");
      return;
    }

    try {
      const response = await fetch(
        "https://basha-vara-backend.vercel.app/api/tenants/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId: item._id,
            tenantId: loginData._id,
            additionalMessage: rentalRequest.specialRequirements,
            moveInDate: rentalRequest.moveInDate,
            rentalDuration: rentalRequest.duration,
            specialRequirements: rentalRequest.specialRequirements,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) throw new Error(resData.message || "Request failed");

      toast.success("Rental request submitted successfully!");
      setIsModalOpen(false);
      setRentalRequest({
        moveInDate: "",
        duration: "",
        specialRequirements: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rental request!");
    }
  };
  console.log("item.category", item?.category);
  console.log(
    "listings",
    data?.data?.map((d) => d.category)
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top Layout: Image | Info | Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Image Section */}
        <div className="col-span-1">
          {item.images.length > 1 ? (
            <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? item.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-10"
              >
                ‹
              </button>
              <Image
                src={item.images[currentImageIndex]}
                alt="House"
                width={400}
                height={300}
                className="rounded-md h-[300px] object-cover"
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
            <Image
              src={item.images[0] ?? "/placeholder.jpg"}
              alt="House"
              width={400}
              height={300}
              className="rounded-md h-[300px] object-cover"
            />
          )}
        </div>

        {/* Info Section */}
        <div className="col-span-1 text-white">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">
            {item.description}
          </h2>
          <p>📍 {item.location}</p>
          <p>💰 {item.rentAmount} / month</p>
          <p>🛏️ {item.numberOfBedrooms} Bedrooms</p>
          <p>🏡 Amenities: {item.amenities}</p>
        </div>

        {/* Rental Conditions & Request Button */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg border border-yellow-600 text-white">
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">
            Rental Conditions
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>No smoking allowed</li>
            <li>No pets (unless agreed)</li>
            <li>Minimum stay: 6 months</li>
            <li>Rent due: 1st of every month</li>
          </ul>
          <button
            onClick={() =>
              loginData?.role === "tenant"
                ? setIsModalOpen(true)
                : toast.info("Only tenants can request rentals!")
            }
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full mt-4 py-2 rounded-md"
          >
            Request Rental
          </button>
        </div>
      </div>

      {/* More Details Section */}
      <div className="bg-gray-900 p-6 rounded-lg text-white mb-8">
        <h3 className="text-lg font-semibold text-yellow-500 mb-2">
          More Details
        </h3>
        <p>
          This rental property is located in a quiet neighborhood, close to
          markets, schools, and parks. Ideal for families or professionals.
        </p>
      </div>

      {/* Suggested Listings */}
      <div className="bg-gray-900 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold text-yellow-500 mb-4">
          Suggested Listings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.data
            ?.filter(
              (l) => l.category?.toLowerCase() === item.category?.toLowerCase()
            )
            .slice(0, 4)
            .map((suggested) => (
              <div
                key={suggested._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <Image
                  src={suggested.images[0] ?? "/placeholder.jpg"}
                  alt="Suggested"
                  width={300}
                  height={200}
                  className="rounded object-cover w-full h-[200px]"
                />
                <h4 className="text-yellow-400 mt-2">
                  {suggested.description}
                </h4>
                <p className="text-gray-400 text-sm">{suggested.location}</p>
                <p className="text-white font-semibold">
                  💰 {suggested.rentAmount} / month
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for Rental Request */}
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
  );
};

export default ListingDetails;
