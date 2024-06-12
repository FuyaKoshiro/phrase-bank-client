import { useQuery } from "@tanstack/react-query";
import { axiosRequester } from "../axiosRequester";
import jsCookie from "js-cookie";
import { captionSchema } from "@/schemas/captionSchema";
import { videoDataFromYouTubeSchema } from "@/schemas/videoDataFromYouTube";

export const captionQueryKeys = {
  captions: (videoId: string) => ["captions", videoId] as const,
  videoData: (videoId: string) => ["videoData", videoId] as const,
};

export function useFetchCaptions(videoId: string | null) {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: captionQueryKeys.captions(videoId!),
    queryFn: () => fetchCaptions(token!, videoId!),
    enabled: !!token && !!videoId,
  });
}

async function fetchCaptions(token: string, videoId: string) {
  try {
    const resopnse = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_captions/`
    );
    return captionSchema.parse(resopnse.data);
  } catch (error) {
    throw error;
  }
}

export function useFetchVideoDataFromYouTube(videoId: string | null) {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: captionQueryKeys.videoData(videoId!),
    queryFn: async () => fetchVideoDataFromYouTube(token!, videoId!),
    enabled: !!token && !!videoId,
  });
}

async function fetchVideoDataFromYouTube(token: string, videoId: string) {
  try {
    const response = await axiosRequester(token).get(
      `/youtube/${videoId}/fetch_video_data_from_youtube/`
    );
    return videoDataFromYouTubeSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
