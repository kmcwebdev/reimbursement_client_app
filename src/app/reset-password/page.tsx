import { type Metadata } from "next";
import React from "react";
import ResetPasswordForm from "../components/reset-password";

export const metadata: Metadata = {
  title: "Profile",
};

const ResetPasswordPage: React.FC = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
