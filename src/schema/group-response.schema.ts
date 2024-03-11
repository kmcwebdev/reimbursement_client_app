import { z } from "zod";
import { groupSchema } from "./group.schema";
import { responsePaginationSchema } from "./response-pagination.schema";

export const groupResponseSchema = responsePaginationSchema.merge(
  z.object({
    results: z.array(groupSchema),
  }),
);
