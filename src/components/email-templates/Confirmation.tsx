import { Text, Link } from "@react-email/components";
import EmailMain from "./email-components/EmailMain";
import { parseTimezone } from "~/utils/parse-timezone";

interface ConfirmationTemplateProps {
  requestType: "scheduled" | "unscheduled";
  referenceNo: string;
  approverName: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
}

export const Confirmation: React.FC<Readonly<ConfirmationTemplateProps>> = ({
  requestType,
  referenceNo,
  approverName,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
}) => (
  <EmailMain receiver={fullName} subject="Confirmation">
    <Text>
      We want to inform you that your reimbursement request {referenceNo} has
      been successfully submitted to {approverName} for review.
    </Text>
    <Text>Below are the details of your submission:</Text>
    <Text>Employee ID: {employeeId}</Text>
    <Text>Expense Description: {expenseType}</Text>
    <Text>Expense Date: {parseTimezone(expenseDate).format("MMMM DD,YYYY")}</Text>
    <Text>Amount: {amount}</Text>
    <Text>
      Receipts Attached:{" "}
      <Link href={receiptsAttached} target="_blank">
        Click here to view
      </Link>
    </Text>
    <Text className="text-justify">
      Your {requestType === "scheduled" ? "HRBP" : "Manager"} will review the
      submitted reimbursement request along with the attached receipts and
      supporting documentation. You will be notified of the approval or
      rejection&rsquo;s status via email. Decision as soon as your
      manager&rsquo;s review is complete. If you have any questions or concerns
      regarding this reimbursement claim, please reach out to the employee
      directly or contact your respective{" "}
      {requestType === "scheduled" ? "HRBP" : "Manager"}&apos;s
    </Text>
    <Text>Thank you for your attention to this matter.</Text>
  </EmailMain>
);
