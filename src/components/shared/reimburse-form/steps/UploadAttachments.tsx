/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { Button } from "~/components/core/Button";
import { showToast } from "~/components/core/Toast";
import Upload from "~/components/core/Upload";
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

const UploadAttachments: React.FC = () => {
  const { activeStep, reimbursementDetails, fileUploadedUrl, fileSelected } =
    useAppSelector((state) => state.reimbursementForm);
  const dispatch = useAppDispatch();

  const [
    uploadFiles,
    {
      isLoading: isUploading,
      isSuccess: isUploadingSuccess,
      data: uploadedFile,
    },
  ] = useUploadFileMutation();

  const [createReimbursement, { isLoading: isSubmitting }] =
    useCreateReimbursementMutation();

  const handleReimburse = () => {
    if (uploadedFile) {
      dispatch(setReimbursementAttachments(uploadedFile));

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
          attachment: uploadedFile.url,
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
            showToast({
              type: "success",
              description:
                "Your reimbursement request has been submitted successfully!",
            });
          })
          .catch((error: MutationError) => {
            showToast({
              type: "error",
              description: error.data.errors[0].message,
            });
          });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isUploading && "loading..."}
      <Upload
        fileSelected={fileSelected}
        maxFiles={1}
        uploadButtonProps={{
          loading: isUploading,
          disabled: isUploading,
          filePath: fileUploadedUrl,
          onClick: (e) => {
            if (e) {
              const formData = new FormData();
              formData.append("file", e);
              void uploadFiles(formData)
                .unwrap()
                .then((data) => {
                  dispatch(setUploadedFileUrl(data.url));
                })
                .catch(() => {
                  showToast({
                    type: "error",
                    description:
                      "There was a problem uploading your file. Please try again!",
                  });
                });
            }
          },
        }}
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
          disabled={isUploading || !fileUploadedUrl || !isUploadingSuccess}
          loading={isSubmitting}
        >
          Reimburse
        </Button>
      </div>
    </div>
  );
};

export default UploadAttachments;