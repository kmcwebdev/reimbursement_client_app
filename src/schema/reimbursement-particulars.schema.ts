import { z } from "zod";

export const ReimbursementParticularsSchema = z.object({
  expense_type_id: z
    .string({ required_error: "Please choose a type of expense!" })
    .uuid({
      message: "Type of expense is must be a uuid!",
    }),
  remarks: z
    .string({ required_error: "Please input remarks!" })
    .nonempty({
      message: "Please input remarks!",
    })
    .optional(),
  particular: z
    .string({ required_error: "Please input particular!" })
    .nonempty({
      message: "Please input particular!",
    }),
  justification: z
    .string({ required_error: "Please input justification!" })
    .nonempty({
      message: "Please input justification!",
    }),
  amount: z.coerce
    .number({ required_error: "Please input total!" })
    .min(1, "Please input total!"),
});

export type ReimbursementParticulars = z.infer<
  typeof ReimbursementParticularsSchema
>;
