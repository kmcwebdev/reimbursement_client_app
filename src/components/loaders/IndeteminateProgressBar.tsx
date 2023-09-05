import React from "react";

const IndeteminateProgressBar: React.FC = () => {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100">
      <div className="animate-progress origin-left-right h-full w-full bg-green-600"></div>
    </div>
  );
};

export default IndeteminateProgressBar;
