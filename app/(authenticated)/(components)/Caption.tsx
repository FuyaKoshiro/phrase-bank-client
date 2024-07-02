"use client";

import { useFetchCaptions } from "@/queries/youTube/youTube";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { useCreateVideo, useFetchVideos } from "@/queries/video/video";
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
  const [phraseIndexToBeSaved, setPhraseIndexToBeSaved] = React.useState<
    number | undefined
  >(undefined);

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
    caption: CaptionType,
    index: number
  ) {
    setPhraseIndexToBeSaved(index);
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

    setPhraseIndexToBeSaved(undefined);
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
                  className="w-full relative"
                >
                  {caption.index === indexToHighlight ? (
                    <button
                      className="flex flex-row items-center gap-2 px-4 py-1 w-full bg-black rounded-md hover:bg-black/20 active:scale-98 transition duration-150 transform"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId,
                          videoId,
                          fetchCaptionsResult.data[caption.index],
                          caption.index
                        )
                      }
                    >
                      <TypographyP className="text-start text-white">
                        {caption.text}
                      </TypographyP>

                      {createPhraseResult.isLoading &&
                      caption.index === phraseIndexToBeSaved ? (
                        <Loading type="dots" size="xxs" />
                      ) : null}
                    </button>
                  ) : (
                    <button
                      className="flex flex-row items-center gap-2 px-4 py-1 w-full rounded-md hover:bg-accent active:scale-98 transition duration-150 transform"
                      onClick={() =>
                        handleClickPhraseButton(
                          userId,
                          videoId,
                          fetchCaptionsResult.data[caption.index],
                          caption.index
                        )
                      }
                    >
                      <TypographyP className="text-start">
                        {caption.text}
                      </TypographyP>

                      {createPhraseResult.isLoading &&
                      caption.index === phraseIndexToBeSaved ? (
                        <Loading type="dots" size="xxs" />
                      ) : null}
                    </button>
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
