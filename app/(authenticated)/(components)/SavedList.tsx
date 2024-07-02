"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React from "react";
import { transformSecondsToTime } from "./(utils)/helpers";
import { TypographySmall } from "@/components/ui/typographySmall";
import { Button } from "@/components/ui/button";
import {
  useDeletePhrase,
  useFetchPhrasesByUserId,
} from "@/queries/phrase/usePhrase";
import { Loading } from "@lemonsqueezy/wedges";
import useVideoPlayer from "../(hooks)/useVideoPlayer";
import { ScrollArea } from "@/components/ui/scroll-area";

function SavedList() {
  const [deletedPhraseId, setDeletedPhraseId] = React.useState<string>("");

  const fetchPhrasesByUserIdResult = useFetchPhrasesByUserId();
  const deletePhraseResult = useDeletePhrase();

  const videoPlayer = useVideoPlayer();
  const videoId = videoPlayer.videoId;

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
    videoPlayer.setSeekToSeconds(start);
  }

  async function handleClickDeletePhraseButton(phraseId: string) {
    setDeletedPhraseId(phraseId);
    await deletePhraseResult.mutateAsync(phraseId);
    setDeletedPhraseId("");
    fetchPhrasesByUserIdResult.refetch();
  }

  if (fetchPhrasesByUserIdResult.isSuccess && phrasesBelongingToVideo?.length) {
    return (
      <ScrollArea className="overflow-y-auto h-full min-h-0 gap-2 flex flex-col w-full p-2">
        {sortedPhrasesBelongingToVideo?.map((phrase) => (
          <div
            key={phrase.id}
            className="w-full flex gap-2 flex-row py-1 px-2 items-center bg-transparent shadow-none"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleClickDeletePhraseButton(phrase.id)}
              disabled={
                deletePhraseResult.isLoading && deletedPhraseId === phrase.id
              }
            >
              {deletePhraseResult.isLoading && deletedPhraseId === phrase.id ? (
                <Loading type="dots" size="xxs" />
              ) : (
                <DeleteOutlineIcon />
              )}
            </Button>

            <button
              onClick={() => handleClickPhraseCard(phrase.start)}
              className="flex-1 text-start p-2 rounded-md hover:bg-gray-100"
            >
              <p className="text-sm line-clamp-1">{phrase.text}</p>
            </button>

            <p className="text-sm">{transformSecondsToTime(phrase.start)}</p>
          </div>
        ))}
      </ScrollArea>
    );
  } else if (!videoId) {
    return (
      <div className="h-full w-full flex flex-row justify-center items-center">
        <TypographySmall>Select Video</TypographySmall>
      </div>
    );
  } else if (fetchPhrasesByUserIdResult.isLoading) {
    return (
      <div className="h-full w-full flex flex-row justify-center items-center">
        <Loading type="dots" size="xs" />
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
