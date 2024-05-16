"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { OnProgressProps } from "react-player/base";
import { useFetchVideoDataFromYouTube } from "@/hooks/youTube/youTube";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function VideoPlayer() {
  const [windowIsReady, setWindowIsReady] = useState(false);

  const videoPlayerRef = useRef<ReactPlayer>(null);

  const videoPlayerStore = useVideoPlayerStore();

  const fetchVideoDataFromYouTubeResult = useFetchVideoDataFromYouTube(
    videoPlayerStore.videoId
  );

  useEffect(() => {
    if (fetchVideoDataFromYouTubeResult.isSuccess) {
      videoPlayerStore.setVideoTitle(
        fetchVideoDataFromYouTubeResult.data.title
      );
    }
  }, [fetchVideoDataFromYouTubeResult, videoPlayerStore]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (videoPlayerStore.seekToSeconds === null) {
      return;
    }

    seekTo(videoPlayerStore.seekToSeconds);
    videoPlayerStore.setSeekToSeconds(null);
  }, [videoPlayerStore]);

  function seekTo(seconds: number) {
    videoPlayerRef.current?.seekTo(seconds);
  }

  function handleOnProgress(progress: OnProgressProps) {
    const roundedPlayedSeconds = Math.round(progress.playedSeconds);
    videoPlayerStore.setSecondPlaying(roundedPlayedSeconds);
  }

  const youTubeVideoUrl = `https://www.youtube.com/watch?v=${videoPlayerStore.videoId}`;

  return (
    <div className="flex flex-col items-start h-full px-5 lg:px-12">
      <div className="h-20 py-2 flex flex-col justify-end">
        {fetchVideoDataFromYouTubeResult.isSuccess ? (
          <p className="line-clamp-1 text-lg">
            {fetchVideoDataFromYouTubeResult.data?.title}
          </p>
        ) : null}
      </div>

      <div className="h-full w-full rounded-3xl overflow-hidden">
        {windowIsReady && videoPlayerStore.videoId ? (
          <ReactPlayer
            ref={videoPlayerRef}
            url={youTubeVideoUrl}
            width="100%"
            height="100%"
            playing
            controls
            onProgress={handleOnProgress}
          />
        ) : (
          <div className="bg-gray-50 w-full h-full flex flex-row justify-center items-center">
            <div className="flex flex-row items-center gap-2">
              <YouTubeIcon className="text-gray-700" />
              <p className="text-gray-700">Input a URL to Start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
