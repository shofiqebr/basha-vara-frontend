// app/(withCommonLayout)/listings/ListingsPageSuspense.tsx
import { Suspense } from "react";
import ListingsPageClient from "./ListingsPageClient";

// Define a Loading Component
const Loading = () => (
  <div className="text-center text-white mt-20">
    <p>Loading listings, please wait...</p>
  </div>
);

const ListingsPageSuspense = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ListingsPageClient />
    </Suspense>
  );
};

export default ListingsPageSuspense;
