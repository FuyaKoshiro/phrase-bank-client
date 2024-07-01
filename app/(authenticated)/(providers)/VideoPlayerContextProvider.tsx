"use client";

import { ReactNode, useCallback, useState } from "react";
import { VideoPlayerContext } from "../(contexts)/videoPlayerContext";

const VideoPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [secondPlaying, setSecondPlayingState] = useState(0);
  const [videoId, setVideoIdState] = useState<string | null>("");
  const [videoTitle, setVideoTitleState] = useState<string | null>(null);
  const [seekToSeconds, setSeekToSecondsState] = useState<number | null>(0);

  const setSecondPlaying = useCallback((second: number) => {
    setSecondPlayingState(second);
  }, []);

  const setVideoId = useCallback((videoId: string) => {
    setVideoIdState(videoId);
  }, []);

  const setVideoTitle = useCallback((title: string) => {
    setVideoTitleState(title);
  }, []);

  const setSeekToSeconds = useCallback((second: number | null) => {
    setSeekToSecondsState(second);
  }, []);

  return (
    <VideoPlayerContext.Provider
      value={{
        secondPlaying,
        videoId,
        videoTitle,
        seekToSeconds,
        setSecondPlaying,
        setVideoId,
        setVideoTitle,
        setSeekToSeconds,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export default VideoPlayerProvider;
