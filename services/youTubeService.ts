import { axiosRequester } from "@/queries/axiosRequester";
import { captionSchema } from "@/schemas/captionSchema";
import { videoDataFromYouTubeSchema } from "@/schemas/videoDataFromYouTube";
import { z } from "zod";
import jsCookie from "js-cookie";

export async function fetchCaptions(videoId: string) {
  const token = jsCookie.get("token");

  try {
    const resopnse = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_captions/`
    );
    return z.array(captionSchema).parse(resopnse.data);
  } catch (error) {
    throw error;
  }
}

export async function fetchVideoDataFromYouTube(videoId: string) {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_video_data_from_youtube/`
    );
    return videoDataFromYouTubeSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
