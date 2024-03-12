import { z } from "zod";

export const particularDetailsSchema = z.object({
  expense_type: z.coerce
    .number({ required_error: "Please select request type!" })
    .min(1, "Please select request type!"),
  remarks: z
    .string({ required_error: "Please input remarks!" })
    .nonempty({
      message: "Please input remarks!",
    })
    .optional(),
  name: z.string({ required_error: "Please input particular name!" }).nonempty({
    message: "Please input particular name!",
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
