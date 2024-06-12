import { SavedVideoWithDate } from "@/app/(authenticated)/(types)/SavedVideoWithDate";
import { Phrase } from "@/schemas/phraseSchema";
import { Video } from "@/schemas/videoSchema";
import { z } from "zod";

export function getSavedVideoTitles(
  savedVideos: Video[],
  savedPhrases: Phrase[]
) {
  const savedVideosWithDate: SavedVideoWithDate[] = [];

  savedPhrases.map((phrase) => {
    const video = savedVideos.find((video) => video.id === phrase.videoId);
    if (!video) {
      return;
    }

    const savedVideoInList = savedVideosWithDate.find(
      (savedVideo) => savedVideo.videoId === video.id
    );

    if (!savedVideoInList) {
      savedVideosWithDate.push({
        videoId: video.id,
        title: video.title,
        latestPhraseSavedDate: phrase.createdAt,
      } as SavedVideoWithDate);
    } else if (phrase.createdAt > savedVideoInList.latestPhraseSavedDate) {
      savedVideoInList.latestPhraseSavedDate = phrase.createdAt;
    }
  });

  return savedVideosWithDate.sort((a, b) => {
    const aTime = new Date(a.latestPhraseSavedDate);
    const bTime = new Date(b.latestPhraseSavedDate);
    return aTime.getTime() - bTime.getTime();
  });
}

export function extractVideoIdFromUrl(url: string) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    throw new Error("Invalid URL");
  }
}

const VideoId = z.string().regex(/^\S+$/);

export function validateVideoId(videoId: any) {
  try {
    return VideoId.parse(videoId);
  } catch (error) {
    throw error;
  }
}

export function transformSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}
