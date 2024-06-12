import { z } from "zod";

export const phraseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  videoId: z.string(),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  archivedAt: z
    .string()
    .transform((val) => new Date(val))
    .nullable(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
});
export type Phrase = z.infer<typeof phraseSchema>;

export const checkIfPhraseExistsSchema = z.boolean();
export type CheckIfPhraseExists = z.infer<typeof checkIfPhraseExistsSchema>;
