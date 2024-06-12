import { axiosRequester } from "@/hooks/axiosRequester";
import { captionSchema } from "@/schemas/captionSchema";
import { videoDataFromYouTubeSchema } from "@/schemas/videoDataFromYouTube";
import { z } from "zod";

export async function fetchCaptions(token: string, videoId: string) {
  try {
    const resopnse = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_captions/`
    );
    return z.array(captionSchema).parse(resopnse.data);
  } catch (error) {
    throw error;
  }
}

export async function fetchVideoDataFromYouTube(
  token: string,
  videoId: string
) {
  try {
    const response = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_video_data_from_youtube/`
    );
    return videoDataFromYouTubeSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
