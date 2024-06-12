"use client";

import { useFetchCaptions } from "@/hooks/youTube/youTube";
import React, { useEffect, useRef } from "react";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { useUserStore } from "@/stores/userStore";
import { useCreateVideo, useFetchVideos } from "@/hooks/video/video";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typographyP";
import {
  useCreatePhrase,
  useFetchPhrasesByUserId,
} from "@/hooks/phrase/usePhrase";
import { checkIfVideoExists, VideoToCreateType } from "@/services/videoService";
import { Caption as CaptionType } from "@/schemas/captionSchema";
import { checkIfPhraseExists } from "@/services/phraseService";

function Caption() {
  const videoPlayerStore = useVideoPlayerStore();
  const userStore = useUserStore();

  const videoId = videoPlayerStore.videoId;
  const userId = userStore.user?.id;

  const fetchCaptionsResult = useFetchCaptions(videoId);
  const fetchPhrasesByUserIdResult = useFetchPhrasesByUserId();
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

    const videoExists = await checkIfVideoExists(videoId);

    if (!videoExists) {
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
        {fetchCaptionsResult.isSuccess
          ? fetchCaptionsResult.data.map((caption) => {
              return (
                <div
                  key={caption.index}
                  ref={
                    caption.index === indexToHighlight ? playingPhraseRef : null
                  }
                >
                  {caption.index === indexToHighlight ? (
                    <Button
                      className="px-2"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId!,
                          videoId!,
                          fetchCaptionsResult.data[caption.index]
                        )
                      }
                    >
                      <TypographyP className="text-start">
                        {caption.text}
                      </TypographyP>
                    </Button>
                  ) : (
                    <Button
                      className="px-2"
                      variant="ghost"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId!,
                          videoId!,
                          fetchCaptionsResult.data[caption.index]
                        )
                      }
                    >
                      <TypographyP className="text-start">
                        {caption.text}
                      </TypographyP>
                    </Button>
                  )}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Caption;
