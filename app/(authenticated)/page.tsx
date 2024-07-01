"use client";

import React, { ReactNode, useState } from "react";
import Caption from "./(components)/Caption";
import SavedList from "./(components)/SavedList";
import SideNavBar from "./(components)/SideNavBar";
import VideoPlayer from "./(components)/VideoPlayer";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typographyH4";
import SearchBox from "./(components)/SearchBox";
import useVideoPlayer from "./(hooks)/useVideoPlayer";
import { useSearchYouTubeVideos } from "@/queries/youTube/youTube";
import { YouTubeSearchResponseItem } from "@/schemas/videoDataFromYouTube";
import Image from "next/image";
import { TypographySmall } from "@/components/ui/typographySmall";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertTimestampToDateString } from "./(components)/(utils)/helpers";

export default function HomePage() {
  const [openSavedList, setOpenSavedList] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const searchYouTubeVideosResult = useSearchYouTubeVideos(videoSearchQuery);

  const videoPlayer = useVideoPlayer();

  function handleSubmitSearch(query: string) {
    setVideoSearchQuery(query);
  }

  function handleClickOpenSavedList() {
    setOpenSavedList(true);
  }

  function handleClickCloseSavedList() {
    setOpenSavedList(false);
  }

  function handleClickVideoCard(videoId: string) {
    videoPlayer.setVideoId(videoId);
  }

  function renderSearchResult(
    query: string,
    isLoading: boolean,
    isError: boolean,
    data: YouTubeSearchResponseItem[] | undefined
  ) {
    const CommonLayout = ({ children }: { children: ReactNode }) => (
      <div className="w-full h-full flex flex-row justify-center items-center">
        {children}
      </div>
    );

    if (!query) {
      return (
        <CommonLayout>
          <TypographySmall>Search for videos</TypographySmall>
        </CommonLayout>
      );
    }

    if (isLoading) {
      return (
        <CommonLayout>
          <TypographySmall>Loading...</TypographySmall>
        </CommonLayout>
      );
    }

    if (isError) {
      return (
        <CommonLayout>
          <TypographySmall className="text-destructive-500">
            Error occurred.
          </TypographySmall>
        </CommonLayout>
      );
    }

    if (!data) {
      return (
        <CommonLayout>
          <TypographySmall>No videos</TypographySmall>
        </CommonLayout>
      );
    }

    if (data) {
      return (
        <ScrollArea className="w-full max-h-full flex flex-col">
          {data.map((video) => {
            return (
              <Button
                key={video.videoId}
                onClick={() => handleClickVideoCard(video.videoId)}
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
      );
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-dvh w-screen relative">
      {/* NavBar on the left for desktop, and top for mobile */}
      <div className="lg:hidden flex flex-row justify-between items-center w-full py-2 px-2">
        <Sheet>
          <SheetTrigger>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="pt-10 pb-0 px-0 bg-gray-50">
            <SideNavBar />
          </SheetContent>
        </Sheet>

        <p className="text-sm font-bold self-center">Phrase Bank</p>
        <div></div>
      </div>

      <div className="hidden w-64 lg:block h-full">
        <SideNavBar />
      </div>

      {/* VideoPlayer */}
      <div className="w-[100%] lg:flex-1 h-full flex flex-col">
        <div className="p-2 w-1/2">
          <SearchBox onSubmit={handleSubmitSearch} />
        </div>

        {!videoPlayer.videoId ? (
          <div className="flex-1 overflow-hidden p-3">
            {renderSearchResult(
              videoSearchQuery,
              searchYouTubeVideosResult.isLoading,
              searchYouTubeVideosResult.isError,
              searchYouTubeVideosResult.data
            )}
          </div>
        ) : null}

        {videoPlayer.videoId ? (
          <>
            <div className="flex-1 lg:h-[66%]">
              <VideoPlayer />
            </div>
            <div className="h-96 lg:h-[34%]">
              <Caption />
            </div>
          </>
        ) : null}
      </div>

      {/* Saved List */}
      {!videoPlayer.videoId ? (
        <div className="block lg:hidden absolute bottom-5 right-5">
          <Button onClick={handleClickOpenSavedList}>Saved List</Button>
        </div>
      ) : null}

      {openSavedList ? (
        <div className="absolute bottom-4 right-3 left-3 flex-col lg:w-[25%]">
          <Card className="shadow-none h-80 relative">
            <Button
              size="icon"
              onClick={handleClickCloseSavedList}
              className="absolute top-2 right-2 z-10 bg-white"
            >
              <ClearIcon className="text-black" />
            </Button>

            <div className="flex-1 h-full flex-col p-5">
              <SavedList />
            </div>
          </Card>
        </div>
      ) : null}

      <div className="hidden lg:w-[25%] h-full lg:flex flex-col py-10 gap-10">
        <TypographyH4>Saved List</TypographyH4>
        <SavedList />
      </div>
    </div>
  );
}
