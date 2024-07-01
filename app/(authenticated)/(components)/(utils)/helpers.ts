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
    return bTime.getTime() - aTime.getTime();
  });
}

export function extractVideoIdFromUrl(url: string) {
  if (!url.startsWith("https://www.youtube.com/")) {
    throw new Error("URL must start with 'https://www.youtube.com/'");
  }

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    throw new Error("Invalid URL");
  }
}

export const videoIdSchema = z.string().regex(/^\S+$/);

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

export function convertTimestampToDateString(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 3600) {
    return "just now";
  } else if (diffInHours < 24 && now.getDate() === date.getDate()) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return "yesterday";
  } else {
    return formatDate(date);
  }
}

export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const daySuffix = getDaySuffix(day);

  return `${month} ${day}${daySuffix} ${year}`;
}

export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
