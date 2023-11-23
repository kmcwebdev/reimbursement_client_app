import React from "react";
import { Button } from "~/app/components/core/Button";

interface ApproverButtonsProps {
  onReject: () => void;
  onApprove: () => void;
}

const ApproverButtons: React.FC<ApproverButtonsProps> = ({
  onReject,
  onApprove,
}) => {
  return (
    <>
      <Button
        className="w-full"
        buttonType="outlined"
        variant="danger"
        onClick={onReject}
      >
        Reject
      </Button>

      <Button className="w-full" variant="primary" onClick={onApprove}>
        Approve
      </Button>
    </>
  );
};

export default ApproverButtons;
