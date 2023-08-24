import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { useUserAccessContext } from "~/context/AccessContext";

const EmployeeDashboard = dynamic(() => import('~/components/dashboard/employee'));
const FinanceDashboard = dynamic(() => import('~/components/dashboard/Finance'));
const HrbpDashboard = dynamic(() => import('~/components/dashboard/Hrbp'));
const ManagerDashboard = dynamic(() => import('~/components/dashboard/Manager'));

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
