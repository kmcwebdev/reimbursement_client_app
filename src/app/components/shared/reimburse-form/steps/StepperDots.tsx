import React from "react";
import { classNames } from "~/utils/classNames";

interface StepperDotsProps {
  currentStep: number;
}

const StepperDots: React.FC<StepperDotsProps> = ({ currentStep }) => {
  return (
    <div className="my-4 flex items-center justify-center gap-2">
      <div
        className={classNames(
          currentStep === 1 ? "bg-orange-600" : "bg-orange-200",
          "h-2 w-2 rounded-full",
        )}
      ></div>
      <div
        className={classNames(
          currentStep === 2 ? "bg-orange-600" : "bg-orange-200",
          "h-2 w-2 rounded-full",
        )}
      ></div>
    </div>
  );
};

export default StepperDots;
