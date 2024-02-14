import React from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { useAppDispatch } from "~/app/hook";
import {
  setFocusedReimbursementId,
  toggleSideDrawer,
} from "~/features/state/table-state.slice";
import { Button } from "../../core/Button";

interface AdminButtonsProps {
  isOnhold: boolean;
  canOnHold?: boolean;
  handleOnhold: () => void;
}

const AdminButtons: React.FC<AdminButtonsProps> = ({
  isOnhold,
  canOnHold,
  handleOnhold,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
      <Button
        aria-label="Back"
        className="w-full"
        buttonType="outlined"
        variant="neutral"
        onClick={() => {
          dispatch(toggleSideDrawer());
          dispatch(setFocusedReimbursementId(null));
        }}
      >
        Back
      </Button>

      {!isOnhold && canOnHold && (
        <Button
          aria-label="Onhold"
          className="w-full"
          buttonType="outlined"
          variant="neutral"
          onClick={handleOnhold}
        >
          <div className="flex items-center gap-1 text-orange-600">
            <AiOutlinePause className="h-5 w-5" /> Onhold
          </div>
        </Button>
      )}
    </div>
  );
};

export default AdminButtons;
