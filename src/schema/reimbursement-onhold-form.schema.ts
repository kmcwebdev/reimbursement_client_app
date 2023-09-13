import { z } from "zod";

export const OnholdReimbursementSchema = z
  .object({
    onhold_reason: z
      .string({ required_error: "Please enter reason!" }).nonempty('This field is required'),
  })
  ;

export type OnholdReimbursementType = z.infer<
  typeof OnholdReimbursementSchema
>;
