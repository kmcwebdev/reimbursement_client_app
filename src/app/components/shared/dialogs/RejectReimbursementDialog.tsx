import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useRejectReimbursementMutation } from "~/features/api/actions-api-slice";
import {
  closeSideDrawer,
  setFocusedReimbursementId,
  toggleRejectDialog,
} from "~/features/state/table-state.slice";
import { rejectReimbursementSchema } from "~/schema/reimbursement-reject-form.schema";
import { type RejectReimbursementType } from "~/types/reimbursement.types";
import { Button } from "../../core/Button";
import Dialog from "../../core/Dialog";
import { showToast } from "../../core/Toast";
import Form from "../../core/form";
import TextArea from "../../core/form/fields/TextArea";

const RejectReimbursementDialog: React.FC = () => {
  const { rejectDialogIsOpen, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();
  const [rejectReimbursement, { isLoading: isRejecting }] =
    useRejectReimbursementMutation();

  const formReturn = useForm<RejectReimbursementType>({
    resolver: zodResolver(rejectReimbursementSchema),
    mode: "onChange",
  });

  const onAbort = () => {
    formReturn.reset();
    dispatch(toggleRejectDialog());
  };

  const handleConfirmReject = (values: RejectReimbursementType) => {
    if (focusedReimbursementId) {
      const payload = {
        id: focusedReimbursementId,
        remarks: values.remarks,
      };

      void rejectReimbursement(payload)
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            description: "Reimbursement Request successfully rejected!",
          });
          onAbort();
          dispatch(closeSideDrawer());
          dispatch(setFocusedReimbursementId(null));
          formReturn.reset();
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Rejection failed!",
          });
        });
    }
  };

  return (
    <Dialog
      title="Reject Reimbursement?"
      isVisible={rejectDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <Form
        name="rejectReimbursementForm"
        useFormReturn={formReturn}
        onSubmit={handleConfirmReject}
      >
        <div className="flex flex-col gap-8 pt-8">
          <TextArea name="remarks" label="Reasons for Rejection" required />

          <div className="flex items-center gap-4">
            <Button
              aria-label="Cancel"
              type="button"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={onAbort}
            >
              Cancel
            </Button>
            <Button
              aria-label="Reject"
              className="w-1/2"
              variant="danger"
              type="submit"
              disabled={isRejecting}
              loading={isRejecting}
            >
              Reject
            </Button>
          </div>
        </div>
      </Form>
    </Dialog>
  );
};

export default RejectReimbursementDialog;
