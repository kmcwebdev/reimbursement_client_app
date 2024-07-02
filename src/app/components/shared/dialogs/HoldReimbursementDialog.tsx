import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import ReimbursementActionApiService from "~/app/api/services/reimbursement-action-service";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { toggleHoldDialog } from "~/features/state/table-state.slice";
import { onholdReimbursementSchema } from "~/schema/reimbursement-onhold-form.schema";
import { type OnholdReimbursementType } from "~/types/reimbursement.types";
import { Button } from "../../core/Button";
import Dialog from "../../core/Dialog";
import { showToast } from "../../core/Toast";
import Form from "../../core/form";
import TextArea from "../../core/form/fields/TextArea";

const HoldReimbursementDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { holdDialogIsOpen, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const { mutateAsync: holdReimbursement, isLoading: isOnHolding } =
    ReimbursementActionApiService.useOnholdReimbursement({
      onSuccess: () => {
        dispatch(appApiSlice.util.invalidateTags(["ReimbursementRequest"]));
        showToast({
          type: "success",
          description: "Reimbursement Request successfully put onhold!",
        });
        onAbort();
      },
      onError: (error) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      },
    });

  const formReturn = useForm<OnholdReimbursementType>({
    resolver: zodResolver(onholdReimbursementSchema),
    mode: "onChange",
  });
  const onAbort = () => {
    formReturn.reset();
    dispatch(toggleHoldDialog());
  };

  const handleConfirmHold = (values: OnholdReimbursementType) => {
    if (focusedReimbursementId) {
      const payload = {
        id: focusedReimbursementId,
        remarks: values.remarks,
      };

      void holdReimbursement(payload);
    }
  };

  return (
    <Dialog
      title="Hold Reimbursement?"
      isVisible={holdDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <Form
        name="holdReimbursementForm"
        useFormReturn={formReturn}
        onSubmit={handleConfirmHold}
      >
        <div className="flex flex-col gap-8 pt-8">
          <TextArea
            name="remarks"
            label="Reasons for putting on hold"
            required
          />

          <div className="flex items-center gap-4">
            <Button
              aria-label="Cancel"
              type="button"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={onAbort}
              disabled={isOnHolding}
            >
              Cancel
            </Button>
            <Button
              aria-label="Hold"
              className="w-1/2"
              variant="warning"
              type="submit"
              disabled={isOnHolding}
              loading={isOnHolding}
            >
              Hold
            </Button>
          </div>
        </div>
      </Form>
    </Dialog>
  );
};

export default HoldReimbursementDialog;
