import { z } from "zod";
import { responsePaginationSchema } from "./response-pagination.schema";
import { userSchema } from "./user.schema";

export const reimbursementHrbpsSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(userSchema) }),
);
