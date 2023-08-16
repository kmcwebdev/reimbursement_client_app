import React from "react";
import PageAnimation from "../animation/PageAnimation";

const EmployeeDashboard: React.FC = () => {
  return (
    <PageAnimation>
      <div className="grid h-72 place-items-center bg-primary-default text-white">
        Employee Dashboard
      </div>
    </PageAnimation>
  );
};

export default EmployeeDashboard;
