import { z } from "zod";

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
});
export type Video = z.infer<typeof videoSchema>;
