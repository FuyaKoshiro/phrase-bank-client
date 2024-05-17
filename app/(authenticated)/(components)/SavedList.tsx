"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeletePhrase,
  useFetchPhrasesByUserId,
} from "@/hooks/phrase/phrase";
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { transformSecondsToTime } from "./utils/sideNavBarHelpers";

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

  return (
    <div className="lg:py-10 h-full w-full lg:pr-10">
      {/* <Card className="h-full w-full rounded-2xl bg-gray-50 shadow-none">
        <Typography variant="h5" className="p-7">
          Saved Phrases
        </Typography>

        <div className="h-0.5 bg-gray-300 mx-5" />
        {fetchPhrasesByUserIdResult.isLoading ? (
          <div className="h-full w-full flex flex-col justify-center items-center">
            <Spinner />
          </div>
        ) : null}

        {fetchPhrasesByUserIdResult.isSuccess ? (
          <>
            {phrasesBelongingToVideo?.length ? (
              <List className="min-h-0 overflow-y-auto">
                {sortedPhrasesBelongingToVideo?.map((phrase) => (
                  <ListItem
                    key={phrase.id}
                    onClick={() => handleClickPhraseCard(phrase.start)}
                    className="flex flex-row gap-2 h-10"
                  >
                    <ListItemPrefix>
                      <IconButton
                        variant="text"
                        onClick={() => handleClickDeletePhraseButton(phrase.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </ListItemPrefix>
                    <p className="text-start text-sm line-clamp-1">
                      {phrase.text}
                    </p>

                    <p className="px-2 text-sm">
                      {transformSecondsToTime(phrase.start)}
                    </p>
                  </ListItem>
                ))}
              </List>
            ) : (
              <div className="h-full w-full flex flex-row justify-center items-center">
                <Typography variant="paragraph">
                  No phrases saved for this video.
                </Typography>
              </div>
            )}
          </>
        ) : null}
      </Card> */}
    </div>
  );
}

export default SavedList;
