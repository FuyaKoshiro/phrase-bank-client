import { create } from "zustand";

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

export const useVideoPlayerStore = create<State & Actions>((set) => ({
  secondPlaying: 0,
  videoId: "",
  videoTitle: null,
  seekToSeconds: 0,
  video: null,

  setSecondPlaying: (second) => set({ secondPlaying: second }),
  setVideoId: async (videoId) => set({ videoId }),
  setVideoTitle: (title) => set({ videoTitle: title }),
  setSeekToSeconds: (second) => set({ seekToSeconds: second }),
}));
