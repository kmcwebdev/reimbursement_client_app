import React from "react";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { MdDelete } from "react-icons-all-files/md/MdDelete";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  setActiveParticularIndex,
  setParticularDetailsFormIsVisible,
  setReimbursementFormValues,
} from "~/features/state/reimbursement-form-slice";
import { useDialogState } from "~/hooks/use-dialog-state";

interface ParticularProps {
  index: number;
  label: string;
}

const Particular: React.FC<ParticularProps> = ({ index, label }) => {
  const dispatch = useAppDispatch();

  const { reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const { isVisible, open, close } = useDialogState();

  const handleRemove = (i: number) => {
    const particularsCopy = [...reimbursementFormValues.particulars];

    particularsCopy.splice(i, 1);
    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars: particularsCopy,
      }),
    );
  };
  return (
    <>
      <div className="flex w-full items-center justify-between rounded border p-3">
        <div className="flex w-10/12 items-center gap-3">
          <MdReceipt className="h-4 w-4 text-neutral-800" />
          <p className="block w-10/12 text-neutral-800">
            <span className="truncate text-sm">{label}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button aria-label="Delete" buttonType="text" variant="danger">
            <MdDelete className="h-4 w-4" onClick={open} />
          </Button>

          <Button
            aria-label="Arrow"
            buttonType="text"
            variant="primary"
            onClick={() => {
              dispatch(setActiveParticularIndex(index.toString()));
              dispatch(setParticularDetailsFormIsVisible(true));
            }}
          >
            <FaArrowRight className="h-3 w-3  " />
          </Button>
        </div>
      </div>

      <Dialog
        title="Remove Particular?"
        isVisible={isVisible}
        close={close}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you want to remove this particular [{label}]?
          </p>

          <div className="flex items-center gap-4">
            <Button
              aria-label="No"
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={close}
            >
              No
            </Button>
            <Button
              aria-label="Yes,Remove"
              variant="danger"
              className="w-1/2"
              onClick={() => handleRemove(index)}
            >
              Yes, Remove
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Particular;
