"use client";

import React, { useCallback, useState } from "react";
import Caption from "./(components)/Caption";
import SavedList from "./(components)/SavedList";
import SideNavBar from "./(components)/SideNavBar";
import VideoPlayer from "./(components)/VideoPlayer";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TypographyH4 } from "@/components/ui/typographyH4";
import SearchBox from "./(components)/SearchBox";
import useVideoPlayer from "./(hooks)/useVideoPlayer";
import { useSearchYouTubeVideos } from "@/queries/youTube/youTube";
import { useMediaQuery } from "@mui/material";
import SearchResult from "./(components)/SearchResult";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

function RenderForMobile() {
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const searchYouTubeVideosResult = useSearchYouTubeVideos(videoSearchQuery);

  const videoPlayer = useVideoPlayer();

  const handleSubmitSearch = useCallback((query: string) => {
    setVideoSearchQuery(query);
  }, []);

  const handleClickVideoCard = (videoId: string) => {
    videoPlayer.setVideoId(videoId);
  };

  return (
    <div className="h-dvh w-screen flex flex-col">
      <div className="flex flex-row justify-between items-center w-full py-2 px-2">
        <Sheet>
          <SheetTrigger>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="pt-10 pb-0 px-0 bg-gray-50">
            <SideNavBar />
          </SheetContent>
        </Sheet>

        <p className="text-sm font-bold self-center">Phrase Bank</p>

        <div className="h-7 w-7" />
      </div>

      <div className="p-2">
        <SearchBox onSubmit={handleSubmitSearch} />
      </div>

      {!videoPlayer.videoId ? (
        <div className="flex-1 p-3">
          <SearchResult
            query={videoSearchQuery}
            isLoading={searchYouTubeVideosResult.isLoading}
            isError={searchYouTubeVideosResult.isError}
            data={searchYouTubeVideosResult.data}
            onClickVideoCard={handleClickVideoCard}
          />
        </div>
      ) : null}

      {videoPlayer.videoId ? (
        <>
          <div className="flex-1">
            <VideoPlayer />
          </div>
          <div className="h-96">
            <Caption />
          </div>
        </>
      ) : null}

      {videoPlayer.videoId ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="absolute bottom-5 right-5">Saved List</Button>
          </DrawerTrigger>
          <DrawerContent className="h-96">
            <SavedList />
          </DrawerContent>
        </Drawer>
      ) : null}
    </div>
  );
}

function RenderForDesktop() {
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const searchYouTubeVideosResult = useSearchYouTubeVideos(videoSearchQuery);

  const videoPlayer = useVideoPlayer();

  const handleSubmitSearch = useCallback((query: string) => {
    setVideoSearchQuery(query);
  }, []);

  const handleClickVideoCard = (videoId: string) => {
    videoPlayer.setVideoId(videoId);
  };

  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="w-64 h-full">
        <SideNavBar />
      </div>

      <div className="flex-1 h-full flex flex-col">
        <div className="w-2/3 p-3">
          <SearchBox onSubmit={handleSubmitSearch} />
        </div>

        {!videoPlayer.videoId ? (
          <div className="flex-1 p-3">
            <SearchResult
              query={videoSearchQuery}
              isLoading={searchYouTubeVideosResult.isLoading}
              isError={searchYouTubeVideosResult.isError}
              data={searchYouTubeVideosResult.data}
              onClickVideoCard={handleClickVideoCard}
            />
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

      <div className="w-1/4 h-full flex flex-col py-10 gap-10">
        <TypographyH4>Saved List</TypographyH4>
        <SavedList />
      </div>
    </div>
  );
}

export default function HomePage() {
  const isMobileScreen = useMediaQuery("(max-width: 639px)");

  if (isMobileScreen) {
    return <RenderForMobile />;
  } else {
    return <RenderForDesktop />;
  }
}
