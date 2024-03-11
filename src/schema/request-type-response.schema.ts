import { z } from "zod";
import { requestTypeSchema } from "./request-type.schema";
import { responsePaginationSchema } from "./response-pagination.schema";

export const requestTypeResponseSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(requestTypeSchema) }),
);
