import type { NextApiRequest, NextApiResponse } from "next";
import { ManagerApproval } from "~/app/components/email-templates/ManagerApproval";
import { resend } from "~/libs/resend";
import { ManagerApprovalSchema } from "~/schema/email-templates.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const validate = await ManagerApprovalSchema.safeParseAsync(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error);
    }

    const {
      to,
      approverFullName,
      fullName,
      employeeId,
      expenseType,
      expenseDate,
      amount,
      receiptsAttached,
      approvalLink,
      rejectionLink,
      referenceNo,
    } = validate.data;

    const sendEmail = await resend.emails.send({
      from: "KMC Reimbursement <no-reply@reimbursement.kmc.solutions>",
      to,
      subject: `Manager Approval - ${referenceNo}`,
      react: ManagerApproval({
        approverFullName,
        fullName,
        employeeId,
        expenseType,
        expenseDate,
        amount,
        receiptsAttached,
        approvalLink,
        rejectionLink,
      }),
      text: JSON.stringify(validate.data, null, 2),
    });

    return res.status(200).json(sendEmail);
  } catch (error: unknown) {
    return res.status(500).json(error);
  }
}
