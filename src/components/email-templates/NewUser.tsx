import { Text } from "@react-email/components";
import EmailMain from "./email-components/EmailMain";

interface NewUserTemplateProps {
  fullName: string;
  email: string;
  password: string;
}

export const NewUser: React.FC<Readonly<NewUserTemplateProps>> = ({
  fullName,
  email,
  password,
}) => (
  <EmailMain receiver={fullName} subject="Welcome to Reimbursement">
    <Text>
      Welcome to KMC! Congratulations and we welcome you to our Reimbursements
      Application where you can file your scheduled and unscheduled
      reimbursements.
    </Text>
    <Text>Below are the details of your login credentials:</Text>
    <Text>Username: {email}</Text>
    <Text>Password: {password}</Text>
    <Text>Thank you and good luck to your new journey.</Text>
    <Text>Best regards,</Text>
  </EmailMain>
);
