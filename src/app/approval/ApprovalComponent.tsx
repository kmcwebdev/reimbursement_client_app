"use client";
import { redirect } from "next/navigation";
import React from "react";
import MyApprovals from "../components/shared/MyApprovals";
import { useAppSelector } from "../hook";

interface ApprovalComponentProps {}

const ApprovalComponent: React.FC<ApprovalComponentProps> = () => {
  const { user, assignedRole } = useAppSelector((state) => state.session);

  if (
    assignedRole === "REIMBURSEMENT_HRBP" ||
    assignedRole === "REIMBURSEMENT_FINANCE"
  ) {
    redirect("/dashboard");
  }

  if (assignedRole === "REIMBURSEMENT_USER") {
    redirect("/forbidden");
  }

  return <div>{user && <MyApprovals />}</div>;
};

export default ApprovalComponent;
