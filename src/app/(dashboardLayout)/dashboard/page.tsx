"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loginData") || "{}");
    const role = user?.role;

    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "landlord") router.push("/dashboard/landlord");
    else if (role === "tenant") router.push("/dashboard/tenant");
    else router.push("/");
  }, [router]);

  return null;
};

export default Dashboard;
