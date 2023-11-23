import React from "react";

const IndeterminateProgressBar: React.FC = () => {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100">
      <div className="h-full w-full origin-left-right animate-progress bg-green-600"></div>
    </div>
  );
};

export default IndeterminateProgressBar;
