import { createContext } from "react";

type State = {
  secondPlaying: number;
  videoId: string | null;
  videoTitle: string | null;
  seekToSeconds: number | null;
};

type Actions = {
  setSecondPlaying: (second: number) => void;
  setVideoId: (videoId: string) => void;
  setVideoTitle: (title: string) => void;
  setSeekToSeconds: (second: number | null) => void;
};

type VideoPlayerContextType = State & Actions;

export const VideoPlayerContext = createContext<
  VideoPlayerContextType | undefined
>(undefined);
