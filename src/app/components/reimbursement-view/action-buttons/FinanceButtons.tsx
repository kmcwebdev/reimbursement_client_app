import React from "react";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch } from "~/app/hook";
import {
  closeSideDrawer,
  setFocusedReimbursementId,
} from "~/features/state/table-state.slice";

interface FinanceButtonsProps {
  isCrediting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCredit: () => void;
}

const FinanceButtons: React.FC<FinanceButtonsProps> = ({
  isCrediting,
  onApprove,
  onReject,
  onCredit,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
      {!isCrediting && (
        <>
          <Button
            aria-label="Reject"
            className="w-full"
            buttonType="outlined"
            variant="danger"
            onClick={onReject}
          >
            Reject
          </Button>

          <Button
            aria-label="Download"
            className="w-full"
            buttonType="filled"
            variant="success"
            onClick={onApprove}
          >
            Download
          </Button>
        </>
      )}

      {isCrediting && (
        <>
          <Button
            aria-label="Back"
            className="w-full"
            buttonType="outlined"
            variant="neutral"
            onClick={() => {
              dispatch(closeSideDrawer());
              dispatch(setFocusedReimbursementId(null));
            }}
          >
            Back
          </Button>

          <Button
            aria-label="Credit"
            className="w-full"
            buttonType="filled"
            onClick={onCredit}
          >
            Credit
          </Button>
        </>
      )}
    </div>
  );
};

export default FinanceButtons;
