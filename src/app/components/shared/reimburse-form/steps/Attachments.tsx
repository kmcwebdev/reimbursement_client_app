import React from "react";
import { useAppSelector } from "~/app/hook";
import WebCam from "./WebCam";

const Attachments: React.FC = () => {
  const { selectedAttachmentMethod } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  return (
    <div className="py-4">
      {selectedAttachmentMethod === "capture" && <WebCam />}
    </div>
  );
};

export default Attachments;
