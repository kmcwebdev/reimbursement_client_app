import { z } from "zod";
import { expenseTypeSchema } from "./expense-type.schema";
import { responsePaginationSchema } from "./response-pagination.schema";

export const expenseTypeResponseSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(expenseTypeSchema) }),
);
