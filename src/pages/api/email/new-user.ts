import type { NextApiRequest, NextApiResponse } from "next";
import { NewUser } from "~/components/email-templates/NewUser";
import { resend } from "~/libs/resend";
import { NewUserEmailSchema } from "~/schema/email-templates.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const validate = await NewUserEmailSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error);
    }

    const {
      to,
      fullName,
      email,
       password
    } = validate.data;

    const sendEmail = await resend.emails.send({
      from: "KMC Reimbursement <no-reply@reimbursement.kmc.solutions>",
      to,
      subject: "Welcome to Reimbursement!",
      react: NewUser({
        fullName,
        email,
        password
      }),
      text: JSON.stringify(validate.data, null, 2),
    });

    return res.status(200).json(sendEmail);
  } catch (error: unknown) {
    return res.status(500).json(error);
  }
}
