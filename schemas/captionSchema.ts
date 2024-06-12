import { z } from "zod";

export const captionSchema = z.object({
  index: z.number(),
  text: z.string(),
  start: z.number(),
  end: z.number(),
});
export type Caption = z.infer<typeof captionSchema>;
