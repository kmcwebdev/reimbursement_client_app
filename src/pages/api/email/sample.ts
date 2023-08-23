import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { EmailTemplate } from "~/components/email-templates/Sample";

const resend = new Resend("re_BW6DFXVh_6jyCKzXwCZDpwuB5Qwq5d4Rm");

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = await resend.emails.send({
      from: "Reimbursement <no-reply@kmcc-app.cc>",
      to: ["chrisgelosulit@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
      text: "",
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
