import { axiosRequester } from "../axiosRequester";
import jsCookie from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Video } from "@/types/Video";

export const videoQueryKeys = {
  videos: ["videos"] as const,
  video: ["video"] as const,
  selfCheck: ["selfCheck"] as const,
  createVideo: (videoId: string) => ["createVideo", videoId] as const,
};

export function useFetchVideos(ids: string[] | undefined) {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: videoQueryKeys.videos,
    queryFn: () => fetchVideos(token!, ids!),
    enabled: !!token && ids && ids.length > 0,
  });
}

async function fetchVideos(token: string, ids: string[]): Promise<Video[]> {
  try {
    const response = await axiosRequester(token).post("/video/fetch_videos/", {
      videoIds: ids,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useCheckIfVideoExists(videoId: string | null) {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: videoQueryKeys.selfCheck,
    queryFn: () => checkIfVideoExists(token!, videoId!),
    enabled: !!token && !!videoId,
  });
}

async function checkIfVideoExists(
  token: string,
  videoId: string
): Promise<boolean> {
  try {
    const response = await axiosRequester(token).get(
      `/video/check_if_video_exists/${videoId}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useCreateVideo() {
  const token = jsCookie.get("token");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (video: VideoToCreateType) => {
      if (!token) {
        throw new Error("Token is not found.");
      }
      return createVideo(token, video);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(videoQueryKeys.createVideo(data.id), data);
    },
  });
}

export type VideoToCreateType = {
  id: string;
  title: string;
};

async function createVideo(
  token: string,
  video: VideoToCreateType
): Promise<Video> {
  try {
    const response = await axiosRequester(token).post("/video/", {
      videoData: video,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
