import React from "react";
import { AiOutlinePauseCircle } from "react-icons-all-files/ai/AiOutlinePauseCircle";
import { AiOutlineStop } from "react-icons-all-files/ai/AiOutlineStop";
import { BsChevronDown } from "react-icons-all-files/bs/BsChevronDown";
import { Button } from "~/components/core/Button";
import Popover from "~/components/core/Popover";

interface FinanceButtonsProps {
  isOnHold: boolean;
  currentState: string;
  onApprove: () => void;
  onReject: () => void;
  onHold: () => void;
}

const FinanceButtons: React.FC<FinanceButtonsProps> = ({
  isOnHold,
  currentState,
  onApprove,
  onReject,
  onHold,
}) => {
  return (
    <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
      {!isOnHold && (
        <Popover
          panelClassName="translate-y-[-170px] w-full"
          btn={
            <div className="border-s-1 flex h-full justify-between divide-x-2 rounded-md border p-2">
              <div className="flex h-full flex-1 items-center justify-center gap-2">
                {(currentState === "Reject" && (
                  <AiOutlineStop className="h-6 w-6 text-red-600" />
                )) || (
                  <AiOutlinePauseCircle className="h-6 w-6 text-yellow-600" />
                )}
                <p
                  className={
                    currentState === "Reject"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {currentState}
                </p>
              </div>
              <div className="grid w-[40px] place-items-center">
                <BsChevronDown className="h-[14px] w-[14px] font-semibold text-gray-400 " />
              </div>
            </div>
          }
          content={
            <div className="w-full p-2">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 rounded-sm p-2 hover:bg-gray-100"
                onClick={onReject}
              >
                <AiOutlineStop className="h-6 w-6 text-red-600" />
                <p className="font-karla text-[16px] font-normal">Reject</p>
              </div>
              <div
                className="flex cursor-pointer items-center justify-start gap-2 rounded-sm p-2 hover:bg-gray-100"
                onClick={onHold}
              >
                <AiOutlinePauseCircle className="h-6 w-6 text-yellow-600" />
                <p className="font-karla text-[16px] font-normal">Hold</p>
              </div>
            </div>
          }
        />
      )}

      {isOnHold && (
        <Button
          className="w-full"
          buttonType="outlined"
          variant="danger"
          onClick={onReject}
        >
          Reject
        </Button>
      )}

      <Button
        className="w-full"
        buttonType="filled"
        variant="success"
        onClick={onApprove}
      >
        Download
      </Button>
    </div>
  );
};

export default FinanceButtons;
