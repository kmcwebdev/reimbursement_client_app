import { Link, Text } from "@react-email/components";
import { parseTimezone } from "~/utils/parse-timezone";
import EmailMain from "./email-components/EmailMain";

interface ApprovedTemplateProps {
  referenceNo: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
}

export const Approved: React.FC<Readonly<ApprovedTemplateProps>> = ({
  referenceNo,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
}) => (
  <EmailMain receiver={fullName} subject="Approved">
    <Text>
      We are pleased to inform you that your reimbursement {referenceNo} request has been
      approved. Below are the details of your approved request:
    </Text>

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
      The approved amount will be processed and added to your next paycheck or
      reimbursed according to our company&apos;s reimbursement schedule. You can
      also check the Reimbursement Application to track the payout.
    </Text>
    <Text>Thank you for your attention to this matter.</Text>
  </EmailMain>
);
