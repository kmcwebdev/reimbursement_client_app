import type { NextApiRequest, NextApiResponse } from "next";
import { Confirmation } from "~/app/components/email-templates/Confirmation";
import { resend } from "~/libs/resend";
import { ConfirmationEmailSchema } from "~/schema/email-templates.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const validate = await ConfirmationEmailSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error);
    }

    const {
      to,
      requestType,
      referenceNo,
      approverName,
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
      subject: `New Reimbursement Request - ${referenceNo}`,
      react: Confirmation({
        requestType,
        referenceNo,
        approverName,
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
