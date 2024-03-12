import { z } from "zod";
import { responsePaginationSchema } from "./response-pagination.schema";
import { statusSchema } from "./status.schema";

export const statusResponseSchema = responsePaginationSchema.merge(
  z.object({
    results: z.array(statusSchema),
  }),
);
