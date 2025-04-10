/* eslint-disable @next/next/no-img-element */
"use client";

// import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface RentalFormInputs {
  location: string;
  description: string;
  rent: number;
  images: File[];
  bedrooms: number;
  amenities: string;
}

const PostRentalHouse = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RentalFormInputs>();
  // const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Watch selected images
  const selectedImages = watch("images", []);

  // useEffect(() => {
  //   // Only generate previews on the client side
  //   if (selectedImages.length > 0) {
  //     const imageUrls = selectedImages.map((file: File) =>
  //       URL.createObjectURL(file)
  //     );
  //     setPreviewImages(imageUrls);

  //     // Cleanup created object URLs when component unmounts
  //     return () => {
  //       imageUrls.forEach((url) => URL.revokeObjectURL(url));
  //     };
  //   }
  // }, [selectedImages]);

  const onSubmit: SubmitHandler<RentalFormInputs> = async (data) => {
    try {
      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        data.images.map(async (image: File) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "basha-vara-app"); // Cloudinary upload preset

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dal1rjdwl/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();
          return result.secure_url; // Cloudinary URL
        })
      );

      // Create request body with uploaded image URLs
      const requestBody = {
        location: data.location,
        description: data.description,
        rentAmount: Number(data.rent),
        numberOfBedrooms: Number(data.bedrooms),
        images: imageUrls, // Cloudinary image URLs
        amenities: data.amenities,
        landlordId: "67d0cc9bfa39cc20e9aa6b4a", // Replace with actual landlord ID
      };

      // Send data to your backend
      const response = await fetch(
        "http://localhost:5000/api/landlords/listings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert("Listing posted successfully!");
    } catch (error) {
      console.error("Error posting listing:", error);
      alert("Failed to post listing");
    }
  };

  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFiles = [...selectedImages, ...newFiles];

      setValue("images", updatedFiles); // Update form field
    }
  };

  return (
    <div className="bg-[#1F2937] text-white p-8 rounded-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-[#D97706] mb-4">
        Post Rental House Info
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[#6B7280]">Location</label>
          <input
            {...register("location", { required: true })}
            className="w-full p-2 rounded bg-[#111827] text-white"
          />
          {errors.location && (
            <p className="text-red-500">Location is required</p>
          )}
        </div>

        <div>
          <label className="block text-[#6B7280]">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 rounded bg-[#111827] text-white"
          ></textarea>
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </div>

        <div>
          <label className="block text-[#6B7280]">Rent Amount</label>
          <input
            type="number"
            {...register("rent", { required: true })}
            className="w-full p-2 rounded bg-[#111827] text-white"
          />
          {errors.rent && (
            <p className="text-red-500">Rent amount is required</p>
          )}
        </div>

        <div>
          <label className="block text-[#6B7280]">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagePreview}
            className="w-full p-2 rounded bg-[#111827] text-white"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {watch("images")?.map((file: File, index: number) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[#6B7280]">Number of Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms", { required: true })}
            className="w-full p-2 rounded bg-[#111827] text-white"
          />
          {errors.bedrooms && (
            <p className="text-red-500">Number of bedrooms is required</p>
          )}
        </div>

        <div>
          <label className="block text-[#6B7280]">Amenities</label>
          <input
            {...register("amenities", { required: true })}
            className="w-full p-2 rounded bg-[#111827] text-white"
          />
          {errors.amenities && (
            <p className="text-red-500">Amenities are required</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#D97706] hover:bg-[#b76e04] text-white font-semibold py-2 rounded-lg"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default PostRentalHouse;
