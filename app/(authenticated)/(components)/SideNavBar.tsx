"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useFetchVideos } from "@/queries/video/video";
import {
  extractVideoIdFromUrl,
  getSavedVideoTitles,
  videoIdSchema,
} from "./(utils)/helpers";
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
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/queries/auth/useAuth";
import { useFetchPhrasesByUserId } from "@/queries/phrase/usePhrase";
import { Skeleton } from "@mui/material";
import { Loading } from "@lemonsqueezy/wedges";
import { TypographySmall } from "@/components/ui/typographySmall";
import useVideoPlayer from "../(hooks)/useVideoPlayer";
import useAuth from "@/app/(hooks)/useAuth";

export default function SideNavBar() {
  const [videoId, setVideoId] = useState<string>("");
  const [videoIdValidationError, setVideoIdValidationError] =
    useState<string>("");

  const { user } = useAuth();
  const videoPlayer = useVideoPlayer();

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

  function handleClickVideoCardButton(videoId: string) {
    videoPlayer.setVideoId(videoId);
  }

  async function handleClickSignOutButton() {
    await signOutResult.mutateAsync();
  }

  function handleVideoUrlInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      const videoId = extractVideoIdFromUrl(event.target.value);
      const parsedVideoId = videoIdSchema.parse(videoId);
      setVideoIdValidationError("");
      setVideoId(parsedVideoId);
    } catch (_) {
      setVideoIdValidationError("Invalid video URL");
    }
  }

  async function handleClickSubmitButton(videoId: string) {
    if (videoIdValidationError) {
      return;
    }
    videoPlayer.setVideoId(videoId);
  }

  return (
    <div className="h-full w-full flex flex-col justify-between items-stretch bg-gray-50">
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
            <DialogFooter className="flex items-center gap-2">
              <TypographySmall className="text-destructive">
                {videoIdValidationError}
              </TypographySmall>
              <DialogClose>
                <Button
                  color="black"
                  onClick={() => handleClickSubmitButton(videoId)}
                >
                  <span>Submit</span>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {savedVideosWithDate ? (
          savedVideosWithDate.map((savedVideo) => (
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
        ) : (
          <div className="h-full w-full flex flex-col justify-center items-center">
            <Loading type="dots" size="xs" />
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center gap-5 w-full py-2 px-4 hover:bg-accent hover:text-accent-foreground">
          {user ? (
            <>
              <Avatar className="h-5 w-5 bg-accent flex flex-row items-center justify-center">
                <AvatarImage src={user?.avatar} alt="User Avatar" />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <p className="text-start">{user?.name}</p>
            </>
          ) : (
            <>
              <Skeleton variant="circular" className="h-5 w-5" />
              <Skeleton variant="text" className="w-full" />
            </>
          )}
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
