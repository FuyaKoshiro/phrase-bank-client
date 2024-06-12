import { useQuery } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import {
  fetchCaptions,
  fetchVideoDataFromYouTube,
} from "@/services/youTubeService";

export const captionQueryKeys = {
  captions: (videoId: string) => ["captions", videoId] as const,
  videoData: (videoId: string) => ["videoData", videoId] as const,
};

export function useFetchCaptions(videoId: string | null) {
  return useQuery({
    queryKey: captionQueryKeys.captions(videoId!),
    queryFn: () => fetchCaptions(videoId!),
    enabled: !!videoId,
  });
}

export function useFetchVideoDataFromYouTube(videoId: string | null) {
  return useQuery({
    queryKey: captionQueryKeys.videoData(videoId!),
    queryFn: async () => fetchVideoDataFromYouTube(videoId!),
    enabled: !!videoId,
  });
}
