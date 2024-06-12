import { z } from "zod";

export const videoDataFromYouTubeSchema = z.object({
  videoId: z.string(),
  title: z.string(),
});
export type VideoDataFromYouTube = z.infer<typeof videoDataFromYouTubeSchema>;
