import type { NextApiRequest, NextApiResponse } from "next";
import { HRBPApproval } from "~/app/components/email-templates/HrbpApproval";
import { resend } from "~/libs/resend";
import { HrbpApprovalSchema } from "~/schema/email-templates.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const validate = await HrbpApprovalSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error.errors);
    }

    const {
      to,
      referenceNo,
      approverFullName,
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
      subject: `HRBP Approval - ${referenceNo}`,
      react: HRBPApproval({
        referenceNo,
        approverFullName,
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
