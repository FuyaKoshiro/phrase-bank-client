import { z } from "zod";

export const videoDataFromYouTubeSchema = z.object({
  videoId: z.string(),
  title: z.string(),
});
export type VideoDataFromYouTube = z.infer<typeof videoDataFromYouTubeSchema>;

export const youTubeSearchResponseSchemaItem = z.object({
  videoId: z.string(),
  thumbnails: z.object({
    url: z.string().url(),
    width: z.number(),
    height: z.number(),
  }),
  title: z.string(),
  publishedAt: z.string(),
  channelTitle: z.string(),
  description: z.string(),
});
export type YouTubeSearchResponseItem = z.infer<
  typeof youTubeSearchResponseSchemaItem
>;
