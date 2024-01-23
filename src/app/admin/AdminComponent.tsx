"use client";
import { type Metadata } from "next";
import AdminDashboard from "../dashboard/Admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminComponent = () => {
  return <AdminDashboard />;
};

export default AdminComponent;
