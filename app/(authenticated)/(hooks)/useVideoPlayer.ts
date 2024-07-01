import { useContext } from "react";
import { VideoPlayerContext } from "../(contexts)/videoPlayerContext";

const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  }
  return context;
};

export default useVideoPlayer;
