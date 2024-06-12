import jsCookie from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVideo,
  fetchVideos,
  VideoToCreateType,
} from "@/services/videoService";

export const videoQueryKeys = {
  videos: ["videos"] as const,
  video: ["video"] as const,
  selfCheck: ["selfCheck"] as const,
  createVideo: (videoId: string) => ["createVideo", videoId] as const,
};

export function useFetchVideos(ids: string[] | undefined) {
  return useQuery({
    queryKey: videoQueryKeys.videos,
    queryFn: () => {
      if (!ids) {
        throw new Error("Video ids are not found.");
      }
      fetchVideos(ids);
    },
    enabled: ids && ids.length > 0,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (video: VideoToCreateType) => {
      return createVideo(video);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(videoQueryKeys.createVideo(data.id), data);
    },
  });
}
