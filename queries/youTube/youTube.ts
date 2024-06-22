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

// Unable to run automatically.
// To run this, use refetch().
export function useSearchYouTubeVideos(query: string, startIndex?: number) {
  return useQuery({
    queryKey: ["searchYouTubeVideos", query, startIndex],
    queryFn: async () => searchYouTubeVideos(query, startIndex),
    enabled: false,
  });
}
