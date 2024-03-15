import { z } from "zod";

export const reimbursementTypeSchema = z.object({
  request_type: z.coerce
    .number({ required_error: "Please select request type!" })
    .min(1, "Please select request type!"),
});
