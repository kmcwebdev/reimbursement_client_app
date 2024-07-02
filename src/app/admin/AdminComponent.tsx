"use client";
import { type Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "../dashboard/Admin";
import { useAppSelector } from "../hook";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminComponent = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.session);
  useEffect(() => {
    if (user && !user.is_superuser) {
      router.push("/forbidden");
    }
  }, [router, user]);
  return <AdminDashboard />;
};

export default AdminComponent;
