import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components";
import React, { type PropsWithChildren } from "react";
import { tailwindExtendConfig } from "../../../../../tailwind.config";
import EmailActions from "./EmailActions";
import EmailFooter from "./EmailFooter";
import EmailHeader from "./EmailHeader";

export type SubjectTypes =
  | "Confirmation"
  | "Manager Approval"
  | "HRBP Approval"
  | "Approved"
  | "Rejected"
  | "Welcome to Reimbursement";

interface EmailMainProps {
  subject: SubjectTypes;
  receiver: string;
  approvalLink?: string;
  rejectionLink?: string;
}

const EmailMain: React.FC<PropsWithChildren<EmailMainProps>> = ({
  subject,
  receiver,
  approvalLink,
  rejectionLink,
  children,
}) => {
  return (
    <Tailwind config={{ theme: { extend: { tailwindExtendConfig } } }}>
      <Html>
        <Head />
        <Preview>{subject}</Preview>
        <Body className="mx-auto my-auto bg-gray-100 text-xs">
          <Container className="w-full border bg-white">
            <EmailHeader />
            <Container className="space-y-4 px-4">
              <Text className="text-orange-600">Dear {receiver}</Text>

              {children}

              <Hr className="my-5 border border-gray-300" />
              <EmailActions
                subject={subject}
                approvalLink={approvalLink}
                rejectionLink={rejectionLink}
              />
            </Container>
            <EmailFooter />
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default EmailMain;
