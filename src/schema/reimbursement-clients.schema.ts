import { z } from "zod";
import { reimbursementClientSchema } from "./reimbursement-client.schema";
import { responsePaginationSchema } from "./response-pagination.schema";

export const reimbursementClientsSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(reimbursementClientSchema) }),
);
