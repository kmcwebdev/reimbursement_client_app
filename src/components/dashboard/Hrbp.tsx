import React from "react";
import PageAnimation from "../animation/PageAnimation";

const HrbpDashboard: React.FC = () => {
  return (
    <PageAnimation>
      <div className="grid h-72 place-items-center bg-primary-default text-white">
        HRBP Dashboard
      </div>
    </PageAnimation>
  );
};

export default HrbpDashboard;
