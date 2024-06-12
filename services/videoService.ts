import { axiosRequester } from "@/hooks/axiosRequester";
import { checkIfVideoExistsSchema, videoSchema } from "@/schemas/videoSchema";
import { z } from "zod";
import jsCookie from "js-cookie";

export async function fetchVideos(ids: string[]) {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).post("/video/fetch_videos/", {
      videoIds: ids,
    });
    return z.array(videoSchema).parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function checkIfVideoExists(videoId: string): Promise<boolean> {
  try {
    const token = jsCookie.get("token");

    const response = await axiosRequester(token).get(
      `/video/check_if_video_exists/${videoId}/`
    );
    return checkIfVideoExistsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export type VideoToCreateType = {
  id: string;
  title: string;
};

export async function createVideo(video: VideoToCreateType) {
  const token = jsCookie.get("token");
  
  try {
    const response = await axiosRequester(token).post("/video/", {
      videoData: video,
    });
    return videoSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
