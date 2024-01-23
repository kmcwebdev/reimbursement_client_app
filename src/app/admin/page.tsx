import { type Metadata } from "next";
import AdminComponent from "./AdminComponent";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = () => {
  return <AdminComponent />;
};

export default Dashboard;
