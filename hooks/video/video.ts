import jsCookie from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIfVideoExists, createVideo, fetchVideos, VideoToCreateType } from "@/services/videoService";

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

export function useCheckIfVideoExists(videoId: string | null) {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: videoQueryKeys.selfCheck,
    queryFn: () => checkIfVideoExists(token!, videoId!),
    enabled: !!token && !!videoId,
  });
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

