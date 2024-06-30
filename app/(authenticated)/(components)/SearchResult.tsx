import { useSearchYouTubeVideos } from "@/queries/youTube/youTube";
import React from "react";
import useVideoPlayer from "../(hooks)/useVideoPlayer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TypographyH4 } from "@/components/ui/typographyH4";
import { TypographySmall } from "@/components/ui/typographySmall";
import { TypographyP } from "@/components/ui/typographyP";

interface SearchResultProps {
  query: string;
}

function SearchResult({ query }: SearchResultProps) {
  const searchYouTubeVideosResult = useSearchYouTubeVideos(query);

  const videoPlayer = useVideoPlayer();

  function handleClickVideo(videoId: string) {
    videoPlayer.setVideoId(videoId);
  }

  if (!query) {
    return <div>Enter a search query to see results</div>;
  }

  if (searchYouTubeVideosResult.isLoading) {
    return <div>Loading...</div>;
  }

  if (searchYouTubeVideosResult.isError) {
    throw "An error occurred while fetching search results";
  }

  if (!searchYouTubeVideosResult.data) {
    return <div>No search results found</div>;
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div>{searchYouTubeVideosResult.data.length} videos were found.</div>
      {searchYouTubeVideosResult.data.map((video) => {
        return (
          <Button
            key={video.videoId}
            variant="outline"
            className="h-40 w-full flex flex-row gap-2"
          >
            <div className="relative w-1/4 h-full">
              <Image
                src={video.thumbnail.url}
                fill
                alt="Thumbnail"
                className="rounded-md"
                sizes="100%"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 items-start justify-start h-full overflow-hidden">
              <TypographyH4>{video.title}</TypographyH4>
              <div className="flex flex-row gap-2">
                <TypographySmall>
                  Published at {video.publishedAt}
                </TypographySmall>
                <TypographySmall>By {video.channelTitle}</TypographySmall>
              </div>

              <TypographySmall className="text-wrap text-start">
                {video.description}
              </TypographySmall>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export default SearchResult;
