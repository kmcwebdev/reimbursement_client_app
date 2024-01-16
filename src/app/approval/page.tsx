import { type Metadata } from "next";
import ApprovalComponent from "./ApprovalComponent";

export const metadata: Metadata = {
  title: "Approval",
};

const Approvals = () => {
  return <ApprovalComponent />;
};

export default Approvals;
