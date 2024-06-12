import { axiosRequester } from "@/hooks/axiosRequester";
import { checkIfVideoExistsSchema, videoSchema } from "@/schemas/videoSchema";
import { z } from "zod";

export async function fetchVideos(token: string, ids: string[]) {
  try {
    const response = await axiosRequester(token).post("/video/fetch_videos/", {
      videoIds: ids,
    });
    return z.array(videoSchema).parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function checkIfVideoExists(
  token: string,
  videoId: string
): Promise<boolean> {
  try {
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

export async function createVideo(token: string, video: VideoToCreateType) {
  try {
    const response = await axiosRequester(token).post("/video/", {
      videoData: video,
    });
    return videoSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
