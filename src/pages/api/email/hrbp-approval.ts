import type { NextApiRequest, NextApiResponse } from "next";
import { HRBPApproval } from "~/components/email-templates/HrbpApproval";
import { resend } from "~/libs/resend";
import { NewRequestEmailSchema } from "~/schema/new-request-email.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const validate = await NewRequestEmailSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error.errors);
    }

    const {
      to,
      fullName,
      employeeId,
      expenseType,
      expenseDate,
      amount,
      receiptsAttached,
    } = validate.data;

    const sendEmail = await resend.emails.send({
      from: "KMC Reimbursement <no-reply@kmcc-app.cc>",
      to,
      subject: `HRBP Approval`,
      react: HRBPApproval({
        fullName,
        employeeId,
        expenseType,
        expenseDate,
        amount,
        receiptsAttached,
      }),
      text: JSON.stringify(validate.data, null, 2),
    });

    return res.status(200).json(sendEmail);
  } catch (error: unknown) {
    return res.status(500).json(error);
  }
}
