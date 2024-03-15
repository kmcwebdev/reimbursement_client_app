import { z } from "zod";

export const rejectReimbursementSchema = z.object({
  remarks: z
    .string({ required_error: "Please enter reason!" })
    .nonempty("This field is required"),
});
