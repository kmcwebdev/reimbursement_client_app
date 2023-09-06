import { Text } from "@react-email/components";
import EmailMain from "./email-components/EmailMain";

interface ConfirmationTemplateProps {
  requestId: string;
  hrbpManagerName: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
}

export const Confirmation: React.FC<Readonly<ConfirmationTemplateProps>> = ({
  requestId,
  hrbpManagerName,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
}) => (
  <EmailMain receiver={fullName} subject="Confirmation">
    <Text>
      We want to inform you that your reimbursement request {requestId} has been
      successfully submitted to {hrbpManagerName} for review.
    </Text>
    <Text>Below are the details of your submission:</Text>
    <Text>Employee ID: {employeeId}</Text>
    <Text>Expense Description: {expenseType}</Text>
    <Text>Expense Date: {expenseDate}</Text>
    <Text>Amount: {amount}</Text>
    <Text>Receipts Attached: {receiptsAttached}</Text>
    <Text className="text-justify">
      Your HRBP will review the submitted reimbursement request along with the
      attached receipts and supporting documentation. You will be notified of
      the approval or rejection&rsquo;s status via email. Decision as soon as
      your manager&rsquo;s review is complete. If you have any questions or
      concerns regarding this reimbursement claim, please reach out to the
      employee directly or contact your respective HRBP&apos;s
    </Text>
    <Text>Thank you for your attention to this matter.</Text>
    <Text>Best regards,</Text>
  </EmailMain>
);