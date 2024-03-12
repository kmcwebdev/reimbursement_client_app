import { z } from "zod";
import { reimbursementRequestSchema } from "./reimbursement-request.schema";
import { responsePaginationSchema } from "./response-pagination.schema";

export const requestListResponseSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(reimbursementRequestSchema) }),
);
