import Image from "next/image";
import React from "react";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { type FileStack } from "~/types/reimbursement.types";
import { Button } from "../core/Button";
import EmptyState from "../core/EmptyState";
interface AttachmentsProps {
  attachments: FileStack[];
}

const Attachments: React.FC<AttachmentsProps> = ({ attachments }) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h6 className="text-base font-semibold">Attachments</h6>

      <div className="flex flex-col gap-4">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex h-72 cursor-pointer flex-col items-center justify-between gap-4 rounded-md border p-4"
            onClick={() => window.open(attachment.file_upload)}
          >
            {attachment.file_type.includes("image") && (
              <div className="relative flex h-28 w-full flex-1 overflow-hidden rounded-md">
                <Image fill src={attachment.file_upload} alt="image" />
              </div>
            )}

            {!attachment.file_type.includes("image") && (
              <div className="grid h-28 w-full flex-1 rounded-md bg-neutral-100 p-2">
                <EmptyState
                  title="No Preview Available"
                  description="Access the attachment in a new tab by clicking the arrow button."
                />
              </div>
            )}

            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex w-10/12 items-center gap-3">
                <div className="h-4 w-4">
                  <AiTwotoneFile className="h-4 w-4 text-neutral-800" />
                </div>
                <span className="truncate text-sm font-medium text-neutral-900">
                  {attachment.file_name}
                </span>
              </div>

              <Button aria-label="Arrow" buttonType="text">
                <FaArrowRight className="h-3 w-3 " />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attachments;
