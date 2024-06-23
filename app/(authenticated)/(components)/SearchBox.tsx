import { useSearchYouTubeVideos } from "@/queries/youTube/youTube";
import React, { useState } from "react";
import { searchQuerySchema } from "./utils/searchBoxHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typographySmall";

function SearchBox() {
  const [query, setQuery] = useState<string>("");
  const [searchQueryError, setSearchQueryError] = useState<string>("");

  const searchYouTubeVideosResult = useSearchYouTubeVideos(query);

  // when user focus on the input field, display a modal and display the search results

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const parsedQuery = searchQuerySchema.parse(event.target.value);
      setSearchQueryError("");
      setQuery(parsedQuery);
    } catch (_) {
      setSearchQueryError("Invalid search query");
    }
  }

  function handleClickSubmitButton() {
    searchYouTubeVideosResult.refetch();
  }

  // when a video is cliked, set the video id in the video player store

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <Input
          className="flex-1"
          onChange={handleQueryChange}
          placeholder="Search YouTube"
        />
        <Button onClick={handleClickSubmitButton}>Search</Button>
      </div>
      <TypographySmall className="text-destructive">
        {searchQueryError}
      </TypographySmall>
    </div>
  );
}

export default SearchBox;
