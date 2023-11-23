import { Link, Text } from "@react-email/components";
import { parseTimezone } from "~/utils/parse-timezone";
import EmailMain from "./email-components/EmailMain";

interface ManagerApprovalTemplateProps {
  approverFullName: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
  approvalLink?: string;
  rejectionLink?: string;
}

export const ManagerApproval: React.FC<
  Readonly<ManagerApprovalTemplateProps>
> = ({
  approverFullName,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
  approvalLink,
  rejectionLink,
}) => (
  // TODO: NEED TO REFACTOR ALL EMAIL SCHEMA!!!!!!!!!
  <EmailMain
    receiver={approverFullName}
    subject="Manager Approval"
    approvalLink={approvalLink}
    rejectionLink={rejectionLink}
  >
    <Text>
      I hope this email finds you well. {fullName} has submitted a reimbursement
      claim that requires your approval.
    </Text>
    <Text>Details of the reimbursement claim are as follows:</Text>
    <Text>Employee ID: {employeeId}</Text>
    <Text>Employee Name: {fullName}</Text>
    <Text>Expense Description: {expenseType}</Text>
    <Text>
      Expense Date: {parseTimezone(expenseDate).format("MMMM DD,YYYY")}
    </Text>
    <Text>Amount: {amount}</Text>
    <Text>
      Receipts Attached:{" "}
      <Link href={receiptsAttached} target="_blank">
        Click here to view
      </Link>
    </Text>
    <Text className="text-justify">
      Please review the attached receipts and supporting documentation to verify
      the expenses incurred. Your timely response is greatly appreciated. If you
      have any questions or concerns regarding this reimbursement claim, please
      reach out to the employee directly or contact your respective HRBP&apos;s
    </Text>
    <Text>Thank you for your attention to this matter.</Text>
  </EmailMain>
);
