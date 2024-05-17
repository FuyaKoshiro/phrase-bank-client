"use client";

import React, { useState } from "react";
import Caption from "./(components)/Caption";
import SavedList from "./(components)/SavedList";
import SideNavBar from "./(components)/SideNavBar";
import VideoPlayer from "./(components)/VideoPlayer";
import { Drawer, Button, IconButton, Card } from "@material-tailwind/react";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";

export default function HomePage() {
  const [openSavedList, setOpenSavedList] = useState(false);
  const [openSideNavBar, setOpenSideNavBar] = useState(false);

  function handleClickOpenSavedList() {
    setOpenSavedList(true);
  }

  function handleClickCloseSavedList() {
    setOpenSavedList(false);
  }

  function handleClickOpenSideNavBar() {
    setOpenSideNavBar(true);
  }

  function handleClickCloseNavBar() {
    setOpenSideNavBar(false);
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen relative">
      {/* NavBar on the left for desktop, and top for mobile */}
      <div className="lg:hidden flex flex-row justify-between items-center w-full py-2 px-2">
        {/* <IconButton variant="text" onClick={handleClickOpenSideNavBar}>
          <MenuIcon />
        </IconButton> */}

        <Drawer
          open={openSideNavBar}
          onClose={handleClickCloseNavBar}
          className="p-4"
        >
          <SideNavBar />
        </Drawer>

        <p className="text-sm font-bold">Phrase Bank</p>
        <div />
      </div>

      {/* <div className="hidden w-64 lg:block h-full">
        <SideNavBar />
      </div> */}

      {/* VideoPlayer */}
      {/* <div className="w-[100%] lg:flex-1 h-full flex flex-col">
        <div className="flex-1 lg:h-[66%]">
          <VideoPlayer />
        </div>
        <div className="h-96 lg:h-[34%]">
          <Caption />
        </div>
      </div> */}

      {/* Saved List */}
      {/* <div className="block lg:hidden absolute bottom-5 right-5">
        <Button onClick={handleClickOpenSavedList}>Saved List</Button>
      </div> */}

      {/* {openSavedList ? (
        <div className="absolute bottom-4 right-3 left-3 flex-col lg:w-[25%]">
          <Card className="bg-transparent shadow-none h-80">
            <div className="w-full flex flex-row justify-end items-center">
              <IconButton variant="text" onClick={handleClickCloseSavedList}>
                <ClearIcon />
              </IconButton>
            </div>
            <SavedList />
          </Card>
        </div>
      ) : null}
      <div className="hidden lg:block lg:w-[25%] h-full">
        <SavedList />
      </div> */}
    </div>
  );
}
