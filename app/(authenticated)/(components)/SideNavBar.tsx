"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useFetchVideos } from "@/hooks/video/video";
import {
  extractVideoIdFromUrl,
  getSavedVideoTitles,
  validateVideoId,
} from "./utils/sideNavBarHelpers";
import { useUserStore } from "@/stores/userStore";
import { useVideoPlayerStore } from "../(stores)/videoPlayerStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/auth/useAuth";
import { useFetchPhrasesByUserId } from "@/hooks/phrase/usePhrase";

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

  function handleClickAddVideoButton() {
    handleOpen();
  }

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
  }

  return (
    <div className="h-full w-full flex flex-col justify-between items-stretch bg-gray-50">
      <p className=" text-6xl text-black">{open}</p>
      <div className="flex-1 w-full min-h-0 overflow-y-auto">
        <Dialog>
          <DialogTrigger className="hover:bg-accent hover:text-accent-foreground w-full p-5 flex flex-row gap-2 justify-between items-center">
            <div className="flex flex-row items-center gap-2 justify-start">
              <div className="h-5 w-5 bg-black flex flex-row justify-center items-center">
                <div className="bg-white h-2 w-2" />
              </div>
              <p className="text-sm font-bold">Phrase Bank</p>
            </div>
            <AddIcon />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <p className="text-lg font-bold">Add Video</p>
            </DialogHeader>
            <Input
              placeholder="YouTube Video URL"
              onChange={handleVideoUrlInputChange}
            />
            <DialogFooter>
              <Button
                color="black"
                onClick={() => handleClickSubmitButton(videoUrl)}
              >
                <span>Submit</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {savedVideosWithDate
          ? savedVideosWithDate.map((savedVideo) => (
              <Button
                key={savedVideo.videoId}
                variant="ghost"
                className="py-2 w-full"
                onClick={() => handleClickVideoCardButton(savedVideo.videoId)}
              >
                <p className="line-clamp-1 text-start text-sm w-full">
                  {savedVideo.title}
                </p>
              </Button>
            ))
          : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center gap-5 w-full py-2 px-4 hover:bg-accent hover:text-accent-foreground">
          <Avatar className="h-5 w-5 bg-accent flex flex-row items-center justify-center">
            <AvatarImage src={userStore.user?.avatar} alt="User Avatar" />
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <p className="text-start">{userStore.user?.name}</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button variant="ghost" onClick={handleClickSignOutButton}>
              <p className="text-start text-sm">Sign Out</p>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
