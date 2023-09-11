import { z } from "zod";

export const RejectReimbursementSchema = z
  .object({
    reason_for_rejection: z
      .string({ required_error: "Please enter reason!" }),
  })
  ;

export type RejectReimbursementType = z.infer<
  typeof RejectReimbursementSchema
>;
