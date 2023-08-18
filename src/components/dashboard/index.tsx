import React from "react";
import { useUserAccessContext } from "~/context/AccessContext";
import EmployeeDashboard from "./Employee";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import Sample from "./Sample";

const DashboardComponent: React.FC = () => {
  const { user } = useUserAccessContext();
  return (
    <>
      {user && (
        <>
          {user.role === "employee" && <EmployeeDashboard />}
          {user.role === "finance" && <FinanceDashboard />}
          {user.role === "hrbp" && <HrbpDashboard />}
          {user.role === "manager" && <ManagerDashboard />}
          {user.role === "sample" && <Sample />}
        </>
      )}
    </>
  );
};

export default DashboardComponent;
