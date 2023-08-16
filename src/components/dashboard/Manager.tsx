import React from "react";
import PageAnimation from "../animation/PageAnimation";

const ManagerDashboard: React.FC = () => {
  return (
    <PageAnimation>
      <div className="grid h-72 place-items-center bg-primary-default text-white">
        Manager Dashboard
      </div>
    </PageAnimation>
  );
};

export default ManagerDashboard;
