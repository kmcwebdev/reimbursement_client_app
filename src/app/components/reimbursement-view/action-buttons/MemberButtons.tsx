import React from "react";
import { Button } from "~/app/components/core/Button";
import { useAppSelector } from "~/app/hook";

interface MemberButtonsProps {
  onClose: () => void;
  onCancel: () => void;
  isCancellable: boolean;
}

const MemberButtons: React.FC<MemberButtonsProps> = ({
  onCancel,
  onClose,
  isCancellable,
}) => {
  const { user, assignedRole } = useAppSelector((state) => state.session);

  return (
    <>
      <Button
        onClick={onClose}
        className="w-full"
        buttonType="outlined"
        variant="neutral"
      >
        Back
      </Button>

      {isCancellable &&
        !user?.is_superuser &&
        assignedRole === "REIMBURSEMENT_USER" && (
          <Button className="w-full" variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        )}
    </>
  );
};

export default MemberButtons;
