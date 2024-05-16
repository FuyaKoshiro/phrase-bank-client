"use client";

import { useFetchCaptions } from "@/hooks/youTube/youTube";
import React, { useEffect, useRef } from "react";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { Button, Spinner, Typography } from "@material-tailwind/react";
import { Caption as CaptionType } from "@/types/Caption";
import {
  checkIfPhraseExists,
  useCreatePhrase,
  useFetchPhrasesByUserId,
} from "@/hooks/phrase/phrase";
import { useUserStore } from "@/stores/userStore";
import {
  useCheckIfVideoExists,
  useCreateVideo,
  useFetchVideos,
  VideoToCreateType,
} from "@/hooks/video/video";

function Caption() {
  const videoPlayerStore = useVideoPlayerStore();
  const userStore = useUserStore();

  const videoId = videoPlayerStore.videoId;
  const userId = userStore.user?.id;

  const fetchCaptionsResult = useFetchCaptions(videoId);
  const fetchPhrasesByUserIdResult = useFetchPhrasesByUserId();
  const checkIfVideoExistsResult = useCheckIfVideoExists(videoId);
  const createVideoResult = useCreateVideo();
  const createPhraseResult = useCreatePhrase();

  const videoIds = fetchPhrasesByUserIdResult.data
    ? fetchPhrasesByUserIdResult.data.map((phrase) => phrase.videoId)
    : [];

  const uniqueVideoIds = Array.from(new Set(videoIds));
  const fetchVideosResult = useFetchVideos(uniqueVideoIds);

  const playingPhraseRef = useRef<HTMLDivElement>(null);

  const secondPlaying = videoPlayerStore.secondPlaying;
  const indexPlaying = fetchCaptionsResult.data?.findIndex((caption) => {
    return secondPlaying >= caption.start && secondPlaying <= caption.end;
  });
  const indexToHighlight = indexPlaying ? indexPlaying + 1 : null;

  useEffect(() => {
    if (playingPhraseRef.current) {
      playingPhraseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [indexPlaying]);

  async function handleClickPhraseButton(
    userId: string,
    videoId: string,
    caption: CaptionType
  ) {
    const phrase = {
      userId,
      videoId,
      text: caption.text,
      start: caption.start as number,
      end: caption.end as number,
    };

    const videoExistsResponse = await checkIfVideoExistsResult.refetch();

    if (!videoExistsResponse.data) {
      await createVideoResult.mutateAsync({
        id: videoId,
        title: videoPlayerStore.videoTitle,
      } as VideoToCreateType);
      await fetchVideosResult.refetch();
    }

    const phraseExists = await checkIfPhraseExists(videoId, phrase.start);

    if (!phraseExists) {
      await createPhraseResult.mutateAsync(phrase);
      await fetchPhrasesByUserIdResult.refetch();
    }
  }

  return (
    <div className="px-12 h-full w-full py-7">
      <div className="h-full w-full min-h-0 overflow-y-auto">
        {videoId && fetchCaptionsResult.isLoading ? (
          <div className="h-full w-full flex flex-row items-center justify-center">
            <Spinner />
          </div>
        ) : null}
        {fetchCaptionsResult.isSuccess
          ? fetchCaptionsResult.data.map((caption) => {
              return (
                <div
                  key={caption.index}
                  ref={
                    caption.index === indexToHighlight ? playingPhraseRef : null
                  }
                >
                  <Button
                    variant="text"
                    onClick={() =>
                      handleClickPhraseButton(
                        userId!,
                        videoId!,
                        fetchCaptionsResult.data[caption.index]
                      )
                    }
                    className={`${
                      caption.index === indexToHighlight
                        ? "bg-black text-white"
                        : null
                    }`}
                  >
                    <Typography variant="paragraph" className="text-start">
                      {caption.text}
                    </Typography>
                  </Button>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Caption;
