import { type Metadata } from "next";
import React from "react";
import EmailActionPage from "~/app/components/EmailActionPage";

export const metadata: Metadata = {
  title: "Email Approve/Reject",
};

const EmailAction: React.FC = () => {
  return <EmailActionPage />;
};

export default EmailAction;
