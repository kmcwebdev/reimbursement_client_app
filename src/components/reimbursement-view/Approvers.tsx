import dayjs from "dayjs";
import React from "react";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
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
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              {/* TODO: add not rejected condition */}
              {!approver.has_approved && (
                <MdAccessTimeFilled className="h-4 w-4 text-yellow-600" />
              )}

              {/* TODO: Display rejected */}
              {/* {approver && <MdClose className="h-4 w-4 text-red-600" />} */}

              {approver.has_approved && (
                <HiCheckCircle className="h-4 w-4 text-green-600" />
              )}

              <span className="text-sm text-neutral-900">John Doe Gong</span>
            </div>

            {/* TODO: Display rejected */}
            {/* {date_rejected && (
              <div className="flex justify-between">
                <p>{dayjs(date_rejected).format("MMM D,YYYY")}</p>
                <p>{dayjs(date_rejected).format("hh:mm a")}</p>
              </div>
            )} */}

            <div className="flex justify-between">
              {approver.date_approve && (
                <>
                  <p>{dayjs(approver.date_approve).format("MMM D,YYYY")}</p>
                  <p>{dayjs(approver.date_approve).format("hh:mm a")}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Approvers;
