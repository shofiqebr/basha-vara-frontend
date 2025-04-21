"use client";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users").then(res => res.json()).then(setUsers);
    fetch("/api/admin/listings").then(res => res.json()).then(setListings);
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid gap-4">
        <div className="bg-gray-800 p-4 rounded">Users: {users.length}</div>
        <div className="bg-gray-800 p-4 rounded">Listings: {listings.length}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
