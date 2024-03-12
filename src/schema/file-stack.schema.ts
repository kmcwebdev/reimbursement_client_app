import { z } from "zod";

export const fileStackSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  file_type: z.string(),
  file_source: z.string(),
  file_upload: z.string(),
  file_size: z.number(),
});
