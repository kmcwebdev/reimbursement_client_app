import { z } from "zod";
import { expenseTypeSchema } from "./expense-type.schema";
import { particularDetailsSchema } from "./reimbursement-particulars.schema";

export const noExpenseTypeParticularDetails = particularDetailsSchema.omit({
  expense_type: true,
});

export const particularSchema = noExpenseTypeParticularDetails.merge(
  z.object({
    id: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    expense_type: expenseTypeSchema,
  }),
);
