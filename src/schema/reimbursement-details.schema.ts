import { z } from "zod";

export const reimbursementDetailsSchema = z.object({
  type: z.number({ required_error: "Please choose a reimbursement type!" }),
  expense: z
    .string({ required_error: "Please choose a type of expense!" })
    .nonempty(),
  remarks: z
    .string({ required_error: "Please input remarks!" })
    .nonempty("Please input remarks!"),
  approvers: z
    .object({
      email: z
        .string({
          required_error: "Please add at least 1 approver!",
          invalid_type_error: "Please input at least 1 approver!",
        })
        .nonempty("Please input at least 1 approver!")
        .refine((val) => val.length > 0),
    })
    .array(),
  total: z.preprocess(
    (ipunt) => Number(ipunt),
    z.number({ required_error: "Please input total!" }),
  ),
});
