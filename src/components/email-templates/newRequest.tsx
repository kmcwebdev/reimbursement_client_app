import {
  Body,
  Head,
  Html,
  Preview,
  Img,
  Container,
  Section,
  Button,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";

interface EmailTemplateProps {
  requestId: string;
  hrbpManagerName: string;
  fullName: string;
  employeeId: string;
  expenseType: string;
  expenseDate: string;
  amount: string;
  receiptsAttached: string;
}

export const NewRequest: React.FC<Readonly<EmailTemplateProps>> = ({
  requestId,
  hrbpManagerName,
  fullName,
  employeeId,
  expenseType,
  expenseDate,
  amount,
  receiptsAttached,
}) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>HRBP Approval</Preview>
      <Body className="mx-auto my-auto bg-gray-100">
        <Container className="w-full border bg-white">
          <Img
            className="w-full"
            src="https://erpfilestack.blob.core.windows.net/public/Email_Header.png"
            alt="KMC Reimbursement Email Header"
          />
          <Container className="space-y-4 px-4">
            <Text className="text-primary-default">Dear {fullName}</Text>
            <Text>
              We want to inform you that your reimbursement request {requestId}{" "}
              has been successfully submitted to {hrbpManagerName} for review.
            </Text>
            <Text>Below are the details of your submission:</Text>
            <Text>Employee ID: {employeeId}</Text>
            <Text>Expense Description: {expenseType}</Text>
            <Text>Expense Date: {expenseDate}</Text>
            <Text>Amount: {amount}</Text>
            <Text>Receipts Attached: {receiptsAttached}</Text>
            <Text className="text-justify">
              Your HRBP will review the submitted reimbursement request along
              with the attached receipts and supporting documentation. You will
              be notified of the approval or rejection&rsquo;s status via email.
              Decision as soon as your manager&rsquo;s review is complete. If
              you have any questions or concerns regarding this reimbursement
              claim, please reach out to the employee directly or contact your
              respective HRBP’s
            </Text>
            <Text>Thank you for your attention to this matter.</Text>
            <Text>Best regards,</Text>
            <Hr className="my-5 border border-gray-300" />
            <Section className="my-8 w-1/2 text-center">
              {/* show more analyses footer button */}
              <Button
                className="block w-full text-center font-bold text-white"
                pX={10}
                pY={10}
                style={{
                  backgroundColor: "#FF7200",
                  borderRadius: "5px",
                  fontSize: "16px",
                  textDecoration: "none",
                }}
                href="https://dashboard.stripe.com/login"
              >
                See All Analyses
              </Button>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
