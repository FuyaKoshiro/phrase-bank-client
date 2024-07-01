import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useVideoPlayer from "../(hooks)/useVideoPlayer";

interface SearchBoxProps {
  onSubmit: (query: string) => void;
}

function SearchBox({ onSubmit }: SearchBoxProps) {
  const [query, setQuery] = useState<string>("");

  const videoPlayer = useVideoPlayer();

  async function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleClickSubmitButton(query: string) {
    videoPlayer.setVideoId("");
    onSubmit(query);
  }

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <Input
          className="flex-1"
          onChange={handleQueryChange}
          placeholder="Search YouTube"
        />
        <Button
          disabled={!query}
          onClick={() => handleClickSubmitButton(query)}
        >
          Search
        </Button>
      </div>
    </div>
  );
}

export default SearchBox;
