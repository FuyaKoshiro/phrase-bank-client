"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useFetchPhrasesByUserId } from "@/hooks/phrase/phrase";
import { useFetchVideos } from "@/hooks/video/video";
import {
  extractVideoIdFromUrl,
  getSavedVideoTitles,
  validateVideoId,
} from "./utils/sideNavBarHelpers";
import { useUserStore } from "@/stores/userStore";
import { useSignOut } from "@/hooks/auth/auth";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";

export default function SideNavBar() {
  const [open, setOpen] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const userStore = useUserStore();
  const videoPlayerStore = useVideoPlayerStore();

  const signOutResult = useSignOut();
  const fetchPhrasesByUserIdResult = useFetchPhrasesByUserId();

  const videoIds = fetchPhrasesByUserIdResult.data
    ? fetchPhrasesByUserIdResult.data.map((phrase) => phrase.videoId)
    : [];
  const uniqueVideoIds = Array.from(new Set(videoIds));

  const fetchVideosResult = useFetchVideos(uniqueVideoIds);

  const savedVideosWithDate =
    fetchVideosResult.data && fetchPhrasesByUserIdResult.data
      ? getSavedVideoTitles(
          fetchVideosResult.data,
          fetchPhrasesByUserIdResult.data
        )
      : null;

  async function handleClickVideoCardButton(videoId: string) {
    videoPlayerStore.setVideoId(videoId);
  }

  async function handleClickSignOutButton() {
    await signOutResult.mutateAsync();
  }

  function handleOpen() {
    setOpen(!open);
  }

  function handleVideoUrlInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setVideoUrl(event.target.value);
  }

  async function handleClickSubmitButton(videoUrl: string) {
    const videoId = extractVideoIdFromUrl(videoUrl);
    const validatedVideoId = validateVideoId(videoId);
    videoPlayerStore.setVideoId(validatedVideoId);

    handleOpen();
  }

  return (
    <div className="h-full w-full flex flex-col justify-between items-stretch">
      {/* <List className="h-full w-full bg-gray-50 justify-start min-h-0 overflow-y-auto">
        <ListItem onClick={handleOpen}>
          <ListItemPrefix>
            <div className="h-5 w-5 bg-black flex flex-row justify-center items-center">
              <div className="bg-white h-2 w-2" />
            </div>
          </ListItemPrefix>

          <p className="text-sm font-bold">Phrase Bank</p>

          <ListItemSuffix>
            <AddIcon />
          </ListItemSuffix>
        </ListItem>

        <Dialog open={open} handler={handleOpen}>
          <DialogHeader className="px-5">New Video</DialogHeader>
          <DialogBody>
            <Input
              label="YouTube Video URL"
              variant="outlined"
              crossOrigin={undefined}
              onChange={handleVideoUrlInputChange}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="black"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="black"
              onClick={() => handleClickSubmitButton(videoUrl)}
            >
              <span>Submit</span>
            </Button>
          </DialogFooter>
        </Dialog>

        {savedVideosWithDate
          ? savedVideosWithDate.map((savedVideo) => (
              <ListItem
                key={savedVideo.videoId}
                className="py-2"
                onClick={() => handleClickVideoCardButton(savedVideo.videoId)}
              >
                <p className="line-clamp-1 text-start text-sm">
                  {savedVideo.title}
                </p>
              </ListItem>
            ))
          : null}
      </List>
      <List className="bg-gray-50">
        <ListItem>
          <div className="flex flex-row gap-2 justify-start items-center w-full h-full">
            <Avatar src={userStore.user?.avatar} className="h-5 w-5" />
            <p className="text-start">{userStore.user?.name}</p>
          </div>
        </ListItem>
        <ListItem onClick={handleClickSignOutButton}>
          <p className="text-start text-sm">Sign Out</p>
        </ListItem>
      </List> */}
    </div>
  );
}
