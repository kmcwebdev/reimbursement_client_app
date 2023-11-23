import { Button, Column, Container, Row } from "@react-email/components";
import React from "react";
import { type SubjectTypes } from "./EmailMain";

interface EmailActionsProps {
  subject: SubjectTypes;
  approvalLink?: string;
  rejectionLink?: string;
}

const REMIMBURSEMENT_AUTH_URL =
  "https://reimbursement.kmcc-app.cc/api/auth/login";

const EmailActions: React.FC<EmailActionsProps> = ({
  subject,
  approvalLink,
  rejectionLink,
}) => {
  if (subject === "Confirmation") {
    return null;
  }

  return (
    <>
      {subject === "Manager Approval" && (
        <Container className="mb-4">
          <Row>
            <Column align="left">
              <Button
                className="p-2 text-center text-md text-orange-700 hover:text-orange-700"
                href={REMIMBURSEMENT_AUTH_URL}
              >
                Login to Reimbursement
              </Button>
            </Column>
            <Column align="right">
              <Row>
                <Column align="left">
                  <Button
                    className="mr-1 block rounded-md border border-solid border-red-600 p-2 text-center text-md text-red-600 hover:border-red-700"
                    href={
                      rejectionLink ? rejectionLink : REMIMBURSEMENT_AUTH_URL
                    }
                  >
                    Reject
                  </Button>
                </Column>

                <Column align="right">
                  <Button
                    className="ml-1 block rounded-md bg-orange-600 p-2 text-center text-md text-white hover:bg-orange-700"
                    href={approvalLink ? approvalLink : REMIMBURSEMENT_AUTH_URL}
                  >
                    Approve
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
        </Container>
      )}

      {(subject === "Approved" ||
        subject === "Rejected" ||
        subject === "Welcome to Reimbursement") && (
        <Container className="mb-4">
          <Row>
            <Column align="right">
              <Button
                className="rounded-md bg-orange-600 p-2 text-center text-md text-white hover:bg-orange-700"
                href={REMIMBURSEMENT_AUTH_URL}
              >
                Log in to Reimbursement
              </Button>
            </Column>
          </Row>
        </Container>
      )}
    </>
  );
};

export default EmailActions;
