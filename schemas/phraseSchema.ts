import { z } from "zod";

export const phraseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  archivedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Phrase = z.infer<typeof phraseSchema>;
