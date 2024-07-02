import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH4 } from "@/components/ui/typographyH4";
import { TypographySmall } from "@/components/ui/typographySmall";
import { YouTubeSearchResponseItem } from "@/schemas/videoDataFromYouTube";
import Image from "next/image";
import React from "react";
import { convertTimestampToDateString } from "./(utils)/helpers";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typographyP";
import { Loading } from "@lemonsqueezy/wedges";

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
        <Loading type="dots" size="xxs" />
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
    <ScrollArea className="w-full max-h-full flex flex-col">
      {data.map((video) => {
        return (
          <Button
            key={video.videoId}
            onClick={() => onClickVideoCard(video.videoId)}
            variant="outline"
            className="h-80 w-full flex flex-col items-start sm:justify-start sm:flex-row sm:gap-2 p-0"
          >
            <div className="flex-1 sm:flex-none relative w-full sm:w-2/5 sm:h-full">
              <Image
                src={video.thumbnail.url}
                fill
                alt="Thumbnail"
                className="rounded-md"
                quality={100}
                sizes="100%"
              />
            </div>

            <div className="flex flex-col items-start justify-start sm:h-full overflow-hidden p-3 sm:p-5">
              <TypographyH4 className="text-start text-wrap hidden sm:block">
                {video.title}
              </TypographyH4>

              <p className="text-start text-wrap text-lg sm:hidden line-clamp-1">
                {video.title}
              </p>

              <div className="sm:h-2" />

              <div className="flex flex-row gap-3">
                <TypographySmall className="text-black/50">
                  {video.channelTitle}
                </TypographySmall>

                <Separator orientation="vertical" />

                <TypographySmall className="text-black/50">
                  {convertTimestampToDateString(video.publishedAt)}
                </TypographySmall>
              </div>

              <div className="hidden sm:block sm:h-8" />

              <TypographySmall className="hidden sm:block text-black/50 text-wrap text-start">
                {video.description}
              </TypographySmall>
            </div>
          </Button>
        );
      })}
    </ScrollArea>
  );
}

export default SearchResult;
