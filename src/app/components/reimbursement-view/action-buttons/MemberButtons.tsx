import React from "react";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch } from "~/app/hook";
import {
  setFocusedReimbursementId,
  toggleSideDrawer,
} from "~/features/state/table-state.slice";

interface MemberButtonsProps {
  onCancel: () => void;
  isCancellable: boolean;
}

const MemberButtons: React.FC<MemberButtonsProps> = ({
  onCancel,
  isCancellable,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        aria-label="Back"
        onClick={() => {
          dispatch(toggleSideDrawer());
          dispatch(setFocusedReimbursementId(null));
        }}
        className="w-full"
        buttonType="outlined"
        variant="neutral"
      >
        Back
      </Button>

      {isCancellable && (
        <Button
          aria-label="Cancel"
          className="w-full"
          variant="danger"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </>
  );
};

export default MemberButtons;
