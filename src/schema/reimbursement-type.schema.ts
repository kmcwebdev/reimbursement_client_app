import { z } from "zod";

export const ReimbursementTypeSchema = z.object({
  reimbursement_request_type_id: z
    .string({ required_error: "Please choose a reimbursement type!" })
    .uuid({
      message: "Reimbursement type is must be a uuid!",
    })
    .nonempty(),
});

export type ReimbursementFormType = z.infer<typeof ReimbursementTypeSchema>;
