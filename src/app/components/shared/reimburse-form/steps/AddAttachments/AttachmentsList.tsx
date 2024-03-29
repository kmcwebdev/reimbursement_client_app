import React from "react";
import { FaFileCsv } from "react-icons-all-files/fa/FaFileCsv";
import { FaFilePdf } from "react-icons-all-files/fa/FaFilePdf";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import IndeterminateProgressBar from "~/app/components/loaders/IndeterminateProgressBar";
import { type AttachedFile } from ".";

interface AttachmentsListProps {
  uploadedAttachments: AttachedFile[];
  onDelete: (name: string) => void;
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  uploadedAttachments,
  onDelete,
}) => {
  return (
    <CollapseHeightAnimation
      isVisible={uploadedAttachments.length > 0}
      className="mt-2 flex flex-col gap-2"
    >
      <p className="font-medium text-neutral-900">Receipts</p>
      {uploadedAttachments.length > 0 &&
        uploadedAttachments.map((attachment) => (
          <div
            key={attachment.file.name}
            className="flex w-full items-center gap-3 rounded-md border p-2 px-3"
          >
            <div className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300">
              {attachment.file.type.includes("image") ? (
                <IoMdImage className="h-4 w-4 text-navy" />
              ) : (
                <>
                  {attachment.file.type.includes("pdf") ? (
                    <FaFilePdf className="h-4 w-4 text-navy" />
                  ) : (
                    <FaFileCsv className="h-4 w-4 text-navy" />
                  )}
                </>
              )}
            </div>

            <span className="block w-10/12 gap-2 text-sm text-neutral-900">
              {attachment.status === "uploaded" && (
                <p className="truncate">{attachment.file.name}</p>
              )}

              {attachment.status === "unprocessed" && (
                <div className="flex flex-col gap-2">
                  <p className="truncate">{attachment.file.name}</p>
                  <p className="text-xs text-neutral-400">Queued</p>
                </div>
              )}
              {attachment.status === "uploading" && (
                <div className="flex flex-col gap-2">
                  <p className="truncate">{attachment.file.name}</p>
                  <IndeterminateProgressBar />
                </div>
              )}
            </span>

            {attachment.status === "uploaded" && (
              <MdOutlineDelete
                className="h-5 w-5 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-800"
                onClick={() => onDelete(attachment.file.name)}
              />
            )}
          </div>
        ))}
    </CollapseHeightAnimation>
  );
};

export default AttachmentsList;
