import { Column, Row, Section, Text } from "@react-email/components";
import React from "react";

const EmailFooter: React.FC = () => {
  return (
    <Row className="py-4">
      <Column align="center">
        <Text className="text-xs font-bold">Connect with Us</Text>
        <Section>
          <Row>
            <Column align="center">
              <Row className="w-20">
                <Column>
                  <Section className="h-4 w-4 rounded-md bg-neutral-300"></Section>
                </Column>
                <Column>
                  <Section className="h-4 w-4 rounded-md bg-neutral-300"></Section>
                </Column>
                <Column>
                  <Section className="h-4 w-4 rounded-md bg-neutral-300"></Section>
                </Column>
              </Row>
            </Column>
          </Row>
        </Section>
      </Column>
    </Row>
  );
};

export default EmailFooter;
