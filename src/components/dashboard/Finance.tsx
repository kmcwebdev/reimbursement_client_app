import React from "react";
import PageAnimation from "../animation/PageAnimation";

const FinanceDashboard: React.FC = () => {
  return (
    <PageAnimation>
      <div className="grid h-72 place-items-center bg-primary-default text-white">
        Finance Dashboard
      </div>
    </PageAnimation>
  );
};

export default FinanceDashboard;
