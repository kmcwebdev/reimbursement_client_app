import React from "react";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";

interface AttachmentsProps {
  attachments: string;
}

const Attachments: React.FC<AttachmentsProps> = ({ attachments }) => {
  return (
    <>
      <div className="mt-3 flex flex-col gap-4">
        <h6 className="text-base font-semibold">Attachments</h6>
        <div className="flex w-full items-center justify-between border p-3">
          <div className="flex items-center gap-3">
            <AiTwotoneFile className="h-4 w-4 text-neutral-800" />
            <span className="text-sm text-neutral-900">{attachments}</span>
          </div>
          <FaArrowRight className="h-3 w-3 text-orange-600" />
        </div>
      </div>
    </>
  );
};

export default Attachments;
