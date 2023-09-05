import React from "react";
import { useUserContext } from "~/context/UserContext";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import EmployeeDashboard from "./employee";

const DashboardComponent: React.FC = () => {
  const { user } = useUserContext();
  return (
    <>
      {user && (
        <>
          {user.role === "employee" && <EmployeeDashboard />}
          {user.role === "finance" && <FinanceDashboard />}
          {user.role === "hrbp" && <HrbpDashboard />}
          {user.role === "manager" && <ManagerDashboard />}
        </>
      )}
    </>
  );
};

export default DashboardComponent;
