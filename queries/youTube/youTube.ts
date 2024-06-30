import { useQuery } from "@tanstack/react-query";
import {
  fetchCaptions,
  fetchVideoDataFromYouTube,
  searchYouTubeVideos,
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

export function useSearchYouTubeVideos(query: string) {
  return useQuery({
    queryKey: ["searchYouTubeVideos", query],
    queryFn: async () => searchYouTubeVideos(query),
    enabled: !!query,
  });
}
