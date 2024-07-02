import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH4 } from "@/components/ui/typographyH4";
import { TypographySmall } from "@/components/ui/typographySmall";
import { YouTubeSearchResponseItem } from "@/schemas/videoDataFromYouTube";
import Image from "next/image";
import React from "react";
import { convertTimestampToDateString } from "./(utils)/helpers";

interface SearchResultProps {
  query: string;
  isLoading: boolean;
  isError: boolean;
  data: YouTubeSearchResponseItem[] | undefined;
  onClickVideoCard: (videoId: string) => void;
}

function SearchResult({
  query,
  isLoading,
  isError,
  data,
  onClickVideoCard,
}: SearchResultProps) {
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TypographyH4 className="text-center">Search for videos</TypographyH4>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TypographyH4 className="text-center">Loading...</TypographyH4>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TypographyH4 className="text-center text-destructive-500">
          Error occurred.
        </TypographyH4>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TypographyH4 className="text-center">No videos</TypographyH4>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ScrollArea className="w-full max-h-full flex flex-col">
        {data.map((video) => {
          return (
            <Button
              key={video.videoId}
              onClick={() => onClickVideoCard(video.videoId)}
              variant="outline"
              className="h-80 w-full flex flex-row gap-2 p-0"
            >
              <div className="relative w-2/5 h-full">
                <Image
                  src={video.thumbnail.url}
                  fill
                  alt="Thumbnail"
                  className="rounded-md"
                  quality={100}
                  sizes="100%"
                />
              </div>

              <div className="flex-1 flex flex-col items-start justify-start h-full overflow-hidden p-5">
                <TypographyH4 className="text-start text-wrap">
                  {video.title}
                </TypographyH4>

                <div className="h-2" />

                <div className="flex flex-row gap-1">
                  <TypographySmall className="text-black/50">
                    Published at{" "}
                    {convertTimestampToDateString(video.publishedAt)}
                  </TypographySmall>

                  <TypographySmall className="text-black/50">
                    By {video.channelTitle}
                  </TypographySmall>
                </div>

                <div className="h-8" />

                <TypographySmall className="text-black/50 text-wrap text-start">
                  {video.description}
                </TypographySmall>
              </div>
            </Button>
          );
        })}
      </ScrollArea>
    </div>
  );
}

export default SearchResult;
