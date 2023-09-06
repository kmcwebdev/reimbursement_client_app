import { Button, Column, Container, Row } from "@react-email/components";
import React from "react";
import { type SubjectTypes } from "./EmailMain";

interface EmailActionsProps {
  subject: SubjectTypes;
}

const EmailActions: React.FC<EmailActionsProps> = ({ subject }) => {
  if (subject === "Confirmation") {
    return null;
  }

  return (
    <>
      {(subject === "HRBP Approval" || subject === "Manager Approval") && (
        <Container className="mb-4">
          <Row>
            <Column align="left">
              <Button
                className="p-2 text-center text-md text-orange-700 hover:text-orange-700"
                href="https://dashboard.stripe.com/login"
              >
                Login to Reimbursement
              </Button>
            </Column>
            <Column align="right">
              <Row>
                <Column align="left">
                  <Button
                    className="mr-1 block rounded-md border border-solid border-red-600 p-2 text-center text-md text-red-600 hover:border-red-700"
                    href="https://dashboard.stripe.com/login"
                  >
                    Reject
                  </Button>
                </Column>

                <Column align="right">
                  <Button
                    className="ml-1 block rounded-md bg-orange-600 p-2 text-center text-md text-white hover:bg-orange-700"
                    href="https://dashboard.stripe.com/login"
                  >
                    Approve
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
        </Container>
      )}

      {(subject === "Approved" || subject === "Rejected") && (
        <Container className="mb-4">
          <Row>
            <Column align="right">
              <Button
                className="rounded-md bg-orange-600 p-2 text-center text-md text-white hover:bg-orange-700"
                href="https://dashboard.stripe.com/login"
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
