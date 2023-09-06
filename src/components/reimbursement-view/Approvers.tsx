import React from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdClose } from "react-icons-all-files/md/MdClose";

interface ApproversProps {
  status: string;
  approvers: string;
  daterejected: string;
}

const Approvers: React.FC<ApproversProps> = ({
  status,
  approvers,
  daterejected,
}) => {
  return (
    <>
      <div className="mt-3 flex flex-col gap-4">
        <h6 className="text-base font-semibold">Approvers</h6>
        <div className="flex flex-col gap-2">
          {/* Pending */}
          {status === "pending" && (
            <div className="flex items-center gap-2">
              <MdAccessTimeFilled className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-neutral-900">{approvers}</span>
            </div>
          )}
          {/* Reject */}
          {status === "rejected" && (
            <div className="flex gap-2">
              <MdClose className="h-4 w-4 text-red-600" />
              <div className="flex w-full flex-col">
                <span className="text-sm text-neutral-900">{approvers}</span>
                <div className="flex w-full justify-between">
                  <small className="text-xs text-neutral-800">
                    {daterejected}
                  </small>
                  <small className="text-xs text-neutral-800">09:00 AM</small>
                </div>
              </div>
            </div>
          )}
          {/* Approved */}
          {(status === "approved" ||
            status === "credited" ||
            status === "processing") && (
            <div className="flex gap-2">
              <HiCheckCircle className="h-4 w-4 text-success-default" />
              <div className="flex w-full flex-col">
                <span className="text-sm text-neutral-900">{approvers}</span>
                <div className="flex w-full justify-between">
                  <small className="text-xs text-neutral-800">
                    {daterejected}
                  </small>
                  <small className="text-xs text-gray-500">09:00 AM</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Approvers;
