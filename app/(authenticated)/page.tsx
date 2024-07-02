"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { useMediaQuery } from "@mui/material";
import SearchResult from "./(components)/SearchResult";

export default function HomePage() {
  const [openSavedList, setOpenSavedList] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const searchYouTubeVideosResult = useSearchYouTubeVideos(videoSearchQuery);

  const videoPlayerRef = useRef(useVideoPlayer());

  const handleSubmitSearch = useCallback((query: string) => {
    setVideoSearchQuery(query);
  }, []);

  const handleClickOpenSavedList = useCallback(() => {
    setOpenSavedList((prev) => !prev);
  }, []);

  const handleClickVideoCard = useCallback((videoId: string) => {
    videoPlayerRef.current.setVideoId(videoId);
  }, []);

  const renderForMobile = useMemo(() => {
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

        {!videoPlayerRef.current.videoId ? (
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

        {videoPlayerRef.current.videoId ? (
          <>
            <div className="flex-1">
              <VideoPlayer />
            </div>
            <div className="h-96">
              <Caption />
            </div>
          </>
        ) : null}

        {openSavedList ? (
          <div className="absolute bottom-4 right-3 left-3 flex-col flex">
            <Card className="shadow-none h-80 relative">
              <Button
                size="icon"
                onClick={handleClickOpenSavedList}
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

        {!videoPlayerRef.current.videoId ? (
          <div className="absolute bottom-5 right-5">
            <Button onClick={handleClickOpenSavedList}>Saved List</Button>
          </div>
        ) : null}
      </div>
    );
  }, [
    videoSearchQuery,
    searchYouTubeVideosResult.data,
    searchYouTubeVideosResult.isLoading,
    searchYouTubeVideosResult.isError,
    handleClickVideoCard,
    handleClickOpenSavedList,
    openSavedList,
    handleSubmitSearch,
  ]);

  const renderForDesktop = useMemo(() => {
    return (
      <div className="h-screen w-screen flex flex-row">
        <div className="w-64 h-full">
          <SideNavBar />
        </div>

        <div className="flex-1 h-full flex flex-col">
          <div className="w-1/2">
            <SearchBox onSubmit={handleSubmitSearch} />
          </div>

          {!videoPlayerRef.current.videoId ? (
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

          {videoPlayerRef.current.videoId ? (
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
  }, [
    videoSearchQuery,
    searchYouTubeVideosResult.data,
    searchYouTubeVideosResult.isLoading,
    searchYouTubeVideosResult.isError,
    handleClickVideoCard,
    handleSubmitSearch,
  ]);

  const isMobileScreen = useMediaQuery("(max-width: 639px)");

  if (isMobileScreen) {
    return renderForMobile;
  } else {
    return renderForDesktop;
  }
}
