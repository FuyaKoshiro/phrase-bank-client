import { Video } from "@/schemas/videoSchema";
import {
  convertTimestampToDateString,
  extractVideoIdFromUrl,
  formatDate,
  getDaySuffix,
  getSavedVideoTitles,
  transformSecondsToTime,
} from "./helpers";
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

describe("convertTimestampToDateString", () => {
  it('should return "just now" for timestamps within an hour', () => {
    const now = new Date().toISOString();
    expect(convertTimestampToDateString(now)).toBe("just now");
  });

  it('should return "xx hours ago" for timestamps within the same day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(convertTimestampToDateString(twoHoursAgo)).toBe("2 hours ago");
  });

  it('should return "yesterday" for timestamps one day ago', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(convertTimestampToDateString(yesterday)).toBe("yesterday");
  });

  it("should return formatted date for timestamps two days ago or more", () => {
    const twoDaysAgo = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString();
    const formattedDate = formatDate(new Date(twoDaysAgo));
    expect(convertTimestampToDateString(twoDaysAgo)).toBe(formattedDate);
  });
});

describe("formatDate", () => {
  it("should format the date correctly", () => {
    const date = new Date("2022-07-03T14:48:00.000Z");
    expect(formatDate(date)).toBe("July 3rd 2022");
  });
});

describe("getDaySuffix", () => {
  it('should return "st" for 1', () => {
    expect(getDaySuffix(1)).toBe("st");
  });

  it('should return "nd" for 2', () => {
    expect(getDaySuffix(2)).toBe("nd");
  });

  it('should return "rd" for 3', () => {
    expect(getDaySuffix(3)).toBe("rd");
  });

  it('should return "th" for 4', () => {
    expect(getDaySuffix(4)).toBe("th");
  });

  it('should return "th" for 11', () => {
    expect(getDaySuffix(11)).toBe("th");
  });

  it('should return "th" for 12', () => {
    expect(getDaySuffix(12)).toBe("th");
  });

  it('should return "th" for 13', () => {
    expect(getDaySuffix(13)).toBe("th");
  });

  it('should return "st" for 21', () => {
    expect(getDaySuffix(21)).toBe("st");
  });
});
