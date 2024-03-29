import { Link, Text } from "@react-email/components";
import { parseTimezone } from "~/utils/parse-timezone";
import EmailMain from "./email-components/EmailMain";

interface RejectedTemplateProps {
  referenceNo: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
  remarks: string;
}

export const Rejected: React.FC<Readonly<RejectedTemplateProps>> = ({
  referenceNo,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
  remarks,
}) => (
  <EmailMain receiver={fullName} subject="Rejected">
    <Text>
      We regret to inform you that your recent reimbursement request has been
      reviewed and unfortunately, it has been rejected by your manager/approver.
    </Text>
    <Text>Below are the details of your request:</Text>
    <Text>Employee ID: {employeeId}</Text>
    <Text>Employee Name: {fullName}</Text>
    <Text>Reference Number: {referenceNo}</Text>
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
    <Text>Remarks: {remarks}</Text>
    <Text className="text-justify">
      We understand that this outcome might be disappointing. If you have any
      questions or need further clarification on the rejection, please do not
      hesitate to contact your manager or your HRBP.
    </Text>
    <Text>Thank you for your attention to this matter.</Text>
  </EmailMain>
);
