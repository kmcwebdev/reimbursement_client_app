import { z } from "zod";
import { DefaultEmailSchema } from "./email-templates.schema";

export const RejectReimbursementSchema = z
  .object({
    remarks: z
      .string({ required_error: "Please enter reason!" })
      .nonempty("This field is required"),
  })
  .merge(DefaultEmailSchema);

export type RejectReimbursementType = z.infer<typeof RejectReimbursementSchema>;
