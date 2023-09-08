import type { NextApiRequest, NextApiResponse } from "next";
import { Confirmation } from "~/components/email-templates/Confirmation";
import { resend } from "~/libs/resend";
import { ConfirmationEmailSchema } from "~/schema/email-templates.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const validate = await ConfirmationEmailSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error);
    }

    const {
      to,
      requestId,
      hrbpManagerName,
      fullName,
      employeeId,
      expenseType,
      expenseDate,
      amount,
      receiptsAttached,
    } = validate.data;

    const sendEmail = await resend.emails.send({
      from: "KMC Reimbursement <no-reply@reimbursement.kmc.solutions>",
      to,
      subject: `New Reimbursement Request ${requestId}`,
      react: Confirmation({
        requestId,
        hrbpManagerName,
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
