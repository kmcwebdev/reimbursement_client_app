import React from "react";
import { Button } from "~/app/components/core/Button";

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

      {isCancellable && (
        <Button className="w-full" variant="danger" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </>
  );
};

export default MemberButtons;
