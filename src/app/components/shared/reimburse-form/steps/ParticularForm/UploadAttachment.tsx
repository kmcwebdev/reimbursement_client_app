/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { IoMdImage } from "react-icons-all-files/io/IoMdImage";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import { showToast } from "~/app/components/core/Toast";
import Upload from "~/app/components/core/Upload";
import IndeterminateProgressBar from "~/app/components/loaders/IndeterminateProgressBar";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useUploadFileMutation } from "~/features/reimbursement-api-slice";
import {
  setActiveParticularIndex,
  setActiveParticularStep,
  setReimbursementFormValues,
} from "~/features/reimbursement-form-slice";
import { type ReimbursementParticularDetails } from "~/schema/reimbursement-particulars.schema";

interface UploadAttachmentProps {
  formReturn: UseFormReturn<ReimbursementParticularDetails>;
}

const UploadAttachment: React.FC<UploadAttachmentProps> = ({ formReturn }) => {
  const dispatch = useAppDispatch();

  const [attachedFile, setAttachedFile] = useState<File>();

  const { reimbursementFormValues, activeParticularIndex } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const [uploadFiles, { isLoading: isUploading, isSuccess: isUploaded }] =
    useUploadFileMutation();

  const handleUpload = (file: File) => {
    if (file && activeParticularIndex !== null) {
      const formData = new FormData();
      formData.append("file", file);

      void uploadFiles(formData)
        .unwrap()
        .then((data) => {
          if (
            data &&
            activeParticularIndex !== null &&
            reimbursementFormValues.particulars &&
            reimbursementFormValues.particulars.length > 0
          ) {
            const particularsCopy = [...reimbursementFormValues.particulars];

            const selected = particularsCopy[+activeParticularIndex];

            if (selected) {
              particularsCopy[+activeParticularIndex] = {
                ...selected,
                attachment: data.url,
              };

              dispatch(
                setReimbursementFormValues({
                  ...reimbursementFormValues,
                  particulars: particularsCopy,
                }),
              );
            }
          }
        })
        .catch(() => {
          showToast({
            type: "error",
            description:
              "There was a problem uploading attachments. Please try again!",
          });
        });
    }
  };

  const handleContinue = () => {
    formReturn.reset();
    dispatch(setActiveParticularIndex(null));
    dispatch(setActiveParticularStep("particular-list"));
  };

  return (
    <div className="relative flex flex-col gap-4">
      <Upload
        isUploading={isUploading}
        isUploaded={isUploaded}
        handleUpload={handleUpload}
        setAttachedFile={setAttachedFile}
      />

      <CollapseHeightAnimation
        isVisible={
          activeParticularIndex &&
          reimbursementFormValues.particulars &&
          reimbursementFormValues.particulars.length > 0 &&
          reimbursementFormValues.particulars[+activeParticularIndex] &&
          (reimbursementFormValues.particulars[+activeParticularIndex]
            .attachment ||
            attachedFile)
            ? true
            : false
        }
        className="flex flex-col gap-2"
      >
        {activeParticularIndex &&
          reimbursementFormValues.particulars.length > 0 &&
          reimbursementFormValues.particulars[+activeParticularIndex] && (
            <div className="flex w-full items-center gap-3 rounded-md border p-2 px-3">
              <div className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300">
                <IoMdImage className="h-4 w-4 text-neutral-800" />
              </div>

              <span className="w-10/12 gap-2 truncate  text-sm text-neutral-900">
                {reimbursementFormValues.particulars[+activeParticularIndex]
                  .attachment ? (
                  <p>
                    {
                      reimbursementFormValues.particulars[
                        +activeParticularIndex
                      ].attachment
                    }
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>Getting file URL..</p>
                    <IndeterminateProgressBar />
                  </div>
                )}
              </span>

              <MdOutlineDelete
                className="h-5 w-5 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-800"
                onClick={() => {
                  if (reimbursementFormValues.particulars.length > 0) {
                    const particularsCopy = [
                      ...reimbursementFormValues.particulars,
                    ];
                    const selected = particularsCopy[+activeParticularIndex];
                    particularsCopy[+activeParticularIndex] = {
                      ...selected,
                      attachment: undefined,
                    };
                    dispatch(
                      setReimbursementFormValues({
                        ...reimbursementFormValues,
                        particulars: particularsCopy,
                      }),
                    );
                  }
                }}
              />
            </div>
          )}
      </CollapseHeightAnimation>

      <div className="grid grid-cols-2 items-center gap-2 pt-4">
        <div>
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={() => {
              dispatch(setActiveParticularStep("method-selection"));
            }}
          >
            Return
          </Button>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleContinue}
          disabled={
            activeParticularIndex &&
            reimbursementFormValues.particulars &&
            reimbursementFormValues.particulars.length > 0 &&
            !reimbursementFormValues.particulars[+activeParticularIndex]
              .attachment &&
            isUploading
              ? true
              : false
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default UploadAttachment;
