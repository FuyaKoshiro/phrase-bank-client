import { Video } from "@/schemas/videoSchema";
import {
  extractVideoIdFromUrl,
  getSavedVideoTitles,
  transformSecondsToTime,
} from "./sideNavBarHelpers";
import { Phrase } from "@/schemas/phraseSchema";

describe("getSavedVideoTitles", () => {
  const mockedSavedVideos: Video[] = [
    {
      id: "1",
      title: "title1",
    },
    {
      id: "2",
      title: "title2",
    },
  ];

  const mockedSavedPhrases: Phrase[] = [
    {
      id: "1",
      userId: "1",
      videoId: "1",
      text: "text1",
      start: 1,
      end: 2,
      archivedAt: null,
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
    },
    {
      id: "2",
      userId: "1",
      videoId: "1",
      text: "text2",
      start: 1,
      end: 2,
      archivedAt: null,
      createdAt: new Date("2021-01-02"),
      updatedAt: new Date("2021-01-02"),
    },
    {
      id: "3",
      userId: "1",
      videoId: "2",
      text: "text2",
      start: 1,
      end: 2,
      archivedAt: null,
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
    },
  ];

  it("given savedVideos and savedPhrases, it should return an array of video id, title, and latestSavedDate. Ordered by latestSavedDate. latestSavedDate refers to createdAt value in phrases.", () => {
    const result = getSavedVideoTitles(mockedSavedVideos, mockedSavedPhrases);
    expect(result).toEqual([
      {
        videoId: "1",
        title: "title1",
        latestPhraseSavedDate: new Date("2021-01-02"),
      },
      {
        videoId: "2",
        title: "title2",
        latestPhraseSavedDate: new Date("2021-01-01"),
      },
    ]);
  });
});

describe("extractVideoIdFromUrl", () => {
  it("given a valid youtube video url, it should return the videoId", () => {
    const url = "https://www.youtube.com/watch?v=qbDi-v2NZgo";
    const result = extractVideoIdFromUrl(url);
    expect(result).toEqual("qbDi-v2NZgo");
  });

  it("given an invalid youtube video url, it should throw an error", () => {
    const url = "https://www.youtube.com/watch?v=";
    expect(() => extractVideoIdFromUrl(url)).toThrow();
  });

  it("given a non-youtube video url, it should throw an error", () => {
    const url = "https://www.google.com";
    expect(() => extractVideoIdFromUrl(url)).toThrow();
  });
});

describe("transformSecondsToTime", () => {
  it("given seconds, it should return time in hh:mm:ss format", () => {
    const seconds = 3661;
    const result = transformSecondsToTime(seconds);
    expect(result).toEqual("01:01:01");
  });
});
