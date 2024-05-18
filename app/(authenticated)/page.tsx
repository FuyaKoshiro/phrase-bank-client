"use client";

import React, { useState } from "react";
import Caption from "./(components)/Caption";
import SavedList from "./(components)/SavedList";
import SideNavBar from "./(components)/SideNavBar";
import VideoPlayer from "./(components)/VideoPlayer";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typographyH4";

export default function HomePage() {
  const [openSavedList, setOpenSavedList] = useState(false);

  function handleClickOpenSavedList() {
    setOpenSavedList(true);
  }

  function handleClickCloseSavedList() {
    setOpenSavedList(false);
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen relative">
      {/* NavBar on the left for desktop, and top for mobile */}
      <div className="lg:hidden flex flex-row justify-between items-center w-full py-2 px-2">
        <Sheet>
          <SheetTrigger>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="pt-10 pb-0 px-0 bg-gray-50">
            <SideNavBar />
          </SheetContent>
        </Sheet>

        <p className="text-sm font-bold self-center">Phrase Bank</p>
        <div></div>
      </div>

      <div className="hidden w-64 lg:block h-full">
        <SideNavBar />
      </div>

      {/* VideoPlayer */}
      <div className="w-[100%] lg:flex-1 h-full flex flex-col">
        <div className="flex-1 lg:h-[66%]">
          <VideoPlayer />
        </div>
        <div className="h-96 lg:h-[34%]">
          <Caption />
        </div>
      </div>

      {/* Saved List */}
      <div className="block lg:hidden absolute bottom-5 right-5">
        <Button onClick={handleClickOpenSavedList}>Saved List</Button>
      </div>

      {openSavedList ? (
        <div className="absolute bottom-4 right-3 left-3 flex-col lg:w-[25%]">
          <Card className="shadow-none h-80 relative">
            <Button
              size="icon"
              onClick={handleClickCloseSavedList}
              className="absolute top-2 right-2 z-10 bg-white"
            >
              <ClearIcon className="text-black" />
            </Button>

            <div className="flex-1 h-full flex-col p-5">
              <SavedList />
            </div>
          </Card>
        </div>
      ) : null}

      <div className="hidden lg:w-[25%] h-full lg:flex flex-col py-10 gap-10">
        <TypographyH4>Saved List</TypographyH4>
        <SavedList />
      </div>
    </div>
  );
}
