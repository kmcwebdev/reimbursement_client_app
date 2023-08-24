import {
  Tailwind,
  Html,
  Head,
  Preview,
  Body,
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
        <Text className="text-center text-emerald-700">
          Welcome, {firstName}!
        </Text>
      </Body>
    </Html>
  </Tailwind>
);
