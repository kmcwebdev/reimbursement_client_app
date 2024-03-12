import { z } from "zod";
import { responsePaginationSchema } from "./response-pagination.schema";
import { userSchema } from "./user.schema";

export const usersResponseSchema = responsePaginationSchema.merge(
  z.object({ results: z.array(userSchema) }),
);
