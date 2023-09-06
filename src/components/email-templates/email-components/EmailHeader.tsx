import { Img } from "@react-email/components";
import React from "react";

const EmailHeader: React.FC = () => {
  return (
    <Img
      className="w-full"
      src="https://erpfilestack.blob.core.windows.net/public/Email_Header.png"
      alt="KMC Reimbursement Email Header"
    />
  );
};

export default EmailHeader;
