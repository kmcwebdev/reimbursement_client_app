import React from "react";
import { FaFileCsv } from "react-icons-all-files/fa/FaFileCsv";
import { FaFilePdf } from "react-icons-all-files/fa/FaFilePdf";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import IndeterminateProgressBar from "~/app/components/loaders/IndeterminateProgressBar";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setReimbursementFormValues } from "~/features/state/reimbursement-form-slice";
import { type AttachedFile } from ".";

interface AttachmentsListProps {
  uploadedAttachments: AttachedFile[];
  setUploadedAttachments: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  uploadedAttachments,
  setUploadedAttachments,
}) => {
  const dispatch = useAppDispatch();
  const { reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  return (
    <CollapseHeightAnimation
      isVisible={uploadedAttachments.length > 0}
      className="mt-2 flex flex-col gap-2"
    >
      <p className="font-medium text-neutral-900">Receipts</p>
      {uploadedAttachments.length > 0 &&
        uploadedAttachments.map((attachment, i) => (
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

            <span className="w-10/12 gap-2 truncate  text-sm text-neutral-900">
              {attachment.status === "uploaded" ? (
                <p>{attachment.file.name}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <p>{attachment.file.name}</p>
                  <IndeterminateProgressBar />
                </div>
              )}
            </span>

            <MdOutlineDelete
              className="h-5 w-5 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-800"
              onClick={() => {
                const uploadedAttachmentsCopy = uploadedAttachments;
                uploadedAttachmentsCopy.splice(i, 1);
                setUploadedAttachments(uploadedAttachmentsCopy);

                const reimbursementAttachments =
                  reimbursementFormValues.attachments;
                const updated = reimbursementAttachments.filter(
                  (a) => a.file_name !== attachment.file.name,
                );

                dispatch(
                  setReimbursementFormValues({
                    ...reimbursementFormValues,
                    attachments: updated,
                  }),
                );
              }}
            />
          </div>
        ))}
    </CollapseHeightAnimation>
  );
};

export default AttachmentsList;
