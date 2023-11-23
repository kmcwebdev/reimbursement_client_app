import { type Metadata } from "next";
import DashboardComponent from "./DashboardComponent";

export const metadata: Metadata = {
  title: "Dashboard",
};
const Dashboard = () => {
  return <DashboardComponent />;
};

export default Dashboard;
