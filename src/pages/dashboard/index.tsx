import Head from "next/head";
import React from "react";
import EmployeeDashboard from "~/components/dashboard/employee";
import FinanceDashboard from "~/components/dashboard/Finance";
import HrbpDashboard from "~/components/dashboard/Hrbp";
import ManagerDashboard from "~/components/dashboard/Manager";
import { useUserAccessContext } from "~/context/AccessContext";

// const DashboardComponent = dynamic(() => import("~/components/dashboard"));

const Dashboard: React.FC = () => {
  const { user } = useUserAccessContext();

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      {user && user.role === "employee" && <EmployeeDashboard />}
      {user && user.role === "hrbp" && <HrbpDashboard />}
      {user && user.role === "finance" && <FinanceDashboard />}
      {user && user.role === "manager" && <ManagerDashboard />}
    </>
  );
};

export default Dashboard;
