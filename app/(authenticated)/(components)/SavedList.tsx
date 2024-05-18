"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeletePhrase,
  useFetchPhrasesByUserId,
} from "@/hooks/phrase/phrase";
import React from "react";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { transformSecondsToTime } from "./utils/sideNavBarHelpers";
import { TypographySmall } from "@/components/ui/typographySmall";
import { Button } from "@/components/ui/button";

function SavedList() {
  const fetchPhrasesByUserIdResult = useFetchPhrasesByUserId();
  const deletePhraseResult = useDeletePhrase();

  const videoPlayerStore = useVideoPlayerStore();
  const videoId = videoPlayerStore.videoId;

  const phrasesBelongingToVideo =
    fetchPhrasesByUserIdResult.data &&
    fetchPhrasesByUserIdResult.data.length > 0
      ? fetchPhrasesByUserIdResult.data.filter((phrase) => {
          return phrase.videoId === videoId;
        })
      : [];

  const sortedPhrasesBelongingToVideo = phrasesBelongingToVideo?.sort(
    (a, b) => a.start - b.start
  );

  function handleClickPhraseCard(start: number) {
    videoPlayerStore.setSeekToSeconds(start);
  }

  async function handleClickDeletePhraseButton(phraseId: string) {
    await deletePhraseResult.mutateAsync(phraseId);
    fetchPhrasesByUserIdResult.refetch();
  }

  if (fetchPhrasesByUserIdResult.isSuccess && phrasesBelongingToVideo?.length) {
    return (
      <div className="overflow-y-auto h-full min-h-0 gap-2 pr-2">
        {sortedPhrasesBelongingToVideo?.map((phrase) => (
          <div
            key={phrase.id}
            className="w-full flex gap-2 flex-row py-1 px-2 items-center justify-start bg-transparent shadow-none"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleClickDeletePhraseButton(phrase.id)}
              className="flex-none"
            >
              <DeleteOutlineIcon />
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleClickPhraseCard(phrase.start)}
              className="flex-1 overflow-clip text-start text-sm line-clamp-1"
            >
              {phrase.text}
            </Button>
            <p className="flex-none text-sm">
              {transformSecondsToTime(phrase.start)}
            </p>
          </div>
        ))}
      </div>
    );
  } else if (!videoId) {
    return (
      <div className="h-full w-full flex flex-row justify-center items-center">
        <TypographySmall>Select Video</TypographySmall>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-row justify-center items-center">
        <TypographySmall>No Saved Phrases</TypographySmall>
      </div>
    );
  }
}

export default SavedList;
