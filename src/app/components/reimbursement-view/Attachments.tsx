import React from "react";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { Button } from "../core/Button";

interface AttachmentsProps {
  attachment: string;
  attachment_mask_name: string;
}

const Attachments: React.FC<AttachmentsProps> = ({
  attachment,
  attachment_mask_name,
}) => {
  return (
    <div className="mt-7 flex flex-col gap-4">
      <h6 className="text-base font-semibold">Attachment</h6>
      <div
        className="flex w-full cursor-pointer items-center justify-between rounded border p-3"
        onClick={() => window.open(attachment)}
      >
        <div className="flex w-10/12 items-center gap-3">
          <AiTwotoneFile className="h-4 w-4 text-neutral-800" />
          <span className="truncate text-sm text-neutral-900">
            {attachment_mask_name}
          </span>
        </div>

        <Button buttonType="text">
          <FaArrowRight className="h-3 w-3 " />
        </Button>
      </div>
    </div>
  );
};

export default Attachments;
