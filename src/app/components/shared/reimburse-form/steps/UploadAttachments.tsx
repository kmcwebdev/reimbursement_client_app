/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/app/components/core/Button";
import { showToast } from "~/app/components/core/Toast";
import Upload from "~/app/components/core/Upload";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
    useCreateReimbursementMutation,
    useUploadFileMutation,
} from "~/features/reimbursement-api-slice";
import {
    clearReimbursementForm,
    setActiveStep,
    setReimbursementAttachments,
    setUploadedFileUrl,
    toggleFormDialog,
} from "~/features/reimbursement-form-slice";
import { type MutationError } from "~/types/global-types";
import { type ReimbursementDetailsDTO } from "~/types/reimbursement.types";

interface UploadAttachmentsProps {
  formReturn: UseFormReturn<ReimbursementDetailsDTO>;
}

const UploadAttachments: React.FC<UploadAttachmentsProps> = ({
  formReturn,
}) => {
  const { activeStep, reimbursementDetails, fileUploadedUrl, fileSelected } =
    useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();

  const [uploadFiles, { isLoading: isUploading, isSuccess: isUploaded }] =
    useUploadFileMutation();

  const [createReimbursement, { isLoading: isSubmitting }] =
    useCreateReimbursementMutation();

  const handleReimburse = () => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("file", fileSelected);
      void uploadFiles(formData)
        .unwrap()
        .then((data) => {
          dispatch(setUploadedFileUrl(data.url));

          dispatch(setReimbursementAttachments(data));

          if (reimbursementDetails) {
            const {
              reimbursement_request_type_id,
              expense_type_id,
              amount,
              approvers,
              remarks,
            } = reimbursementDetails;

            let payload: {
              reimbursement_request_type_id: string;
              expense_type_id: string;
              amount: number;
              attachment: string;
              approvers?: string[];
              remarks?: string;
            } = {
              reimbursement_request_type_id,
              expense_type_id,
              amount,
              attachment: data.url,
            };

            const emails: string[] = [];
            if (approvers && approvers.length > 0) {
              approvers.every((item) => {
                emails.push(item.email);
              });
            }

            if (emails.length > 0) {
              payload = { ...payload, approvers: emails };
            }

            if (remarks) {
              payload = { ...payload, remarks };
            }

            void createReimbursement(payload)
              .unwrap()
              .then(() => {
                dispatch(toggleFormDialog());
                dispatch(clearReimbursementForm());
                formReturn.reset();
                showToast({
                  type: "success",
                  description:
                    "Your reimbursement request has been submitted successfully!",
                });
              })
              .catch((error: MutationError) => {
                if( Array.isArray(error.data.errors) ) {
                  showToast({
                    type: "error",
                    description: error.data.errors[0].message,
                  });
                } else { 
                  showToast({
                    type: "error",
                    description: error.data.message,
                  });
                }
              });
          }
        })
        .catch(() => {
          showToast({
            type: "error",
            description:
              "There was a problem uploading your file. Please try again!",
          });
        });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Upload
        fileSelected={fileSelected}
        isUploading={isUploading}
        isUploaded={isUploaded}
        uploadedFileUrl={fileUploadedUrl!}
      />

      <div className="my-4 flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-600"></div>
        <div className="h-2 w-2 rounded-full bg-orange-600"></div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4">
        <Button
          type="button"
          buttonType="outlined"
          variant="neutral"
          className="w-full"
          onClick={() => dispatch(setActiveStep(activeStep - 1))}
        >
          Previous
        </Button>
        <Button
          onClick={handleReimburse}
          className="w-full"
          disabled={isUploading || isSubmitting}
          loading={isSubmitting || isUploading}
        >
          {isSubmitting ? "Reimburse" : isUploading ? "Uploading" : "Reimburse"}
        </Button>
      </div>
    </div>
  );
};

export default UploadAttachments;
