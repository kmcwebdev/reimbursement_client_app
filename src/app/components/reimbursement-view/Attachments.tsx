import React from "react";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { type FileStack } from "~/types/reimbursement.types";
import { Button } from "../core/Button";

interface AttachmentsProps {
  attachments: FileStack[];
}

const Attachments: React.FC<AttachmentsProps> = ({ attachments }) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h6 className="text-base font-semibold">Attachments</h6>

      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex w-full cursor-pointer items-center justify-between rounded-md border p-3"
          onClick={() => window.open(attachment.file_upload)}
        >
          <div className="flex w-10/12 items-center gap-3">
            <AiTwotoneFile className="h-4 w-4 text-neutral-800" />
            <span className="truncate text-sm font-medium text-neutral-900">
              {attachment.file_name}
            </span>
          </div>

          <Button aria-label="Arrow" buttonType="text">
            <FaArrowRight className="h-3 w-3 " />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Attachments;
