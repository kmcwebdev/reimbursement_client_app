import { z } from "zod";

export const RejectReimbursementSchema = z.object({
  remarks: z
    .string({ required_error: "Please enter reason!" })
    .nonempty("This field is required"),
});

export type RejectReimbursementType = z.infer<typeof RejectReimbursementSchema>;
