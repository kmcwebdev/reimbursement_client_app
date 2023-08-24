import {
  Body,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        Thank you for joining our waitlist and for your patience
      </Preview>
      <Body>
        <Text className="text-center text-primary-default">
          Welcome, {firstName}!
        </Text>
      </Body>
    </Html>
  </Tailwind>
);
