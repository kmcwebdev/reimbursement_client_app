import dayjs from "dayjs";
import React from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdClose } from "react-icons-all-files/md/MdClose";
// import { MdClose } from "react-icons-all-files/md/MdClose";
import { Approvers } from "~/types/reimbursement.types";

interface ApproversProps {
  approvers: Approvers[];
}

const Approvers: React.FC<ApproversProps> = ({ approvers }) => {
  return (
    <>
      <div className="mt-3 flex flex-col gap-4">
        <h6 className="text-base font-semibold">Approvers</h6>

        {approvers.map((approver) => (
          <div
            key={approver.approval_matrix_id}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              {/* TODO: add not rejected condition */}
              {!approver.has_approved && (
                <MdAccessTimeFilled className="mt-0.1 h-4 w-4 text-yellow-600" />
              )}

              {approver.has_rejected && (
                <MdClose className="h-4 w-4 text-red-600" />
              )}

              {approver.has_approved && (
                <HiCheckCircle className="mt-0.1 h-4 w-4 text-green-600" />
              )}

              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm text-neutral-900">
                  {approver.approver_name
                    ? approver.approver_name
                    : `Approver ID: ${approver.approver_id}`}
                </span>

                <div className="flex justify-between">
                  {approver.has_approved && (
                    <>
                      <p className="text-xs text-neutral-600">
                        {dayjs().format("MMM D, YYYY")}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {dayjs().format("hh:mm A")}
                      </p>
                    </>
                  )}

                  {approver.has_rejected && (
                    <>
                      <p className="text-xs text-neutral-600">
                        {dayjs().format("MMM D, YYYY")}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {dayjs().format("hh:mm A")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Approvers;
