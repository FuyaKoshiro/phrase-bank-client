"use client";

import { useFetchCaptions } from "@/queries/youTube/youTube";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { useCreateVideo, useFetchVideos } from "@/queries/video/video";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typographyP";
import {
  useCreatePhrase,
  useFetchPhrasesByUserId,
} from "@/queries/phrase/usePhrase";
import { checkIfVideoExists, VideoToCreateType } from "@/services/videoService";
import { Caption as CaptionType } from "@/schemas/captionSchema";
import { checkIfPhraseExists } from "@/services/phraseService";
import { Loading } from "@lemonsqueezy/wedges";
import useVideoPlayer from "../(hooks)/useVideoPlayer";

function Caption() {
  const videoPlayer = useVideoPlayer();
  const userStore = useUserStore();

  const videoId = videoPlayer.videoId;
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

  const secondPlaying = videoPlayer.secondPlaying;
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
        title: videoPlayer.videoTitle,
      } as VideoToCreateType);
      await fetchVideosResult.refetch();
    }

    const phraseExists = await checkIfPhraseExists(videoId, phrase.start);

    if (!phraseExists) {
      await createPhraseResult.mutateAsync(phrase);
      await fetchPhrasesByUserIdResult.refetch();
    }
  }

  if (!userId || !videoId) {
    return <></>;
  }

  if (fetchCaptionsResult.isLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <Loading type="dots" size="xs" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-12 h-full w-full py-7 relative">
      <div className="h-full w-full overflow-hidden overflow-y-auto">
        {fetchCaptionsResult.data
          ? fetchCaptionsResult.data.map((caption) => {
              return (
                <div
                  key={caption.index}
                  ref={
                    caption.index === indexToHighlight ? playingPhraseRef : null
                  }
                  className="w-full"
                >
                  {caption.index === indexToHighlight ? (
                    <button
                      className="px-4 py-1 w-full bg-black rounded-md hover:bg-black/20"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId,
                          videoId,
                          fetchCaptionsResult.data[caption.index]
                        )
                      }
                    >
                      <TypographyP className="text-start text-white">
                        {caption.text}
                      </TypographyP>
                    </button>
                  ) : (
                    <button
                      className="px-4 py-1 w-full rounded-md hover:bg-accent"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId,
                          videoId,
                          fetchCaptionsResult.data[caption.index]
                        )
                      }
                    >
                      <TypographyP className="text-start">
                        {caption.text}
                      </TypographyP>
                    </button>
                  )}
                </div>
              );
            })
          : null}
      </div>
      <div className="absolute h-20 w-20 top-10 right-10">
        {createPhraseResult.isLoading ? (
          <Loading type="dots" size="xs" />
        ) : null}
      </div>
    </div>
  );
}

export default Caption;
