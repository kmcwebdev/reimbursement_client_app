import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { Button } from "~/components/core/Button";
import Upload from "~/components/core/Upload";
import {
  useCreateReimbursementMutation,
  useUploadFileMutation,
} from "~/features/reimbursement-api-slice";
import {
  setActiveStep,
  setReimbursementAttachments,
} from "~/features/reimbursement-form-slice";

const UploadAttachments: React.FC = () => {
  const { activeStep, reimbursementDetails } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const [
    uploadFiles,
    {
      isLoading: isUploading,
      isSuccess: isUploadingSuccess,
      data: uploadedFiles,
    },
  ] = useUploadFileMutation();

  const [
    createReimbursement,
    // { isLoading: isCreating, isSuccess: isCreatingSuccess, data: created },
  ] = useCreateReimbursementMutation();

  const handleReimburse = () => {
    if (uploadedFiles) {
      dispatch(setReimbursementAttachments(uploadedFiles));

      if (reimbursementDetails) {
        const { reimbursement_request_type_id, expense_type_id, amount } =
          reimbursementDetails;
        void createReimbursement({
          reimbursement_request_type_id,
          expense_type_id,
          amount,
          attachment: uploadedFiles.url,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Upload
        uploadButtonProps={{
          loading: isUploading,
          disabled: isUploading,
          onClick: (e) => {
            if (e) {
              const formData = new FormData();
              formData.append("file", e);
              void uploadFiles(formData);
            }
          },
        }}
      />

      <div className="my-4 flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-inactive"></div>
        <div className="h-2 w-2 rounded-full bg-primary-default"></div>
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
          disabled={isUploading && !isUploadingSuccess && !uploadedFiles}
        >
          Reimburse
        </Button>
      </div>
    </div>
  );
};

export default UploadAttachments;
