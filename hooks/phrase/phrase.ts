import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosRequester } from "../axiosRequester";
import jsCookie from "js-cookie";
import { phraseSchema } from "@/schemas/phraseSchema";

export const phraseQueryKeys = {
  phrases: ["phrases"] as const,
  ifPhraseExists: ["ifPhraseExists"] as const,
};

export function useFetchPhrasesByUserId() {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: phraseQueryKeys.phrases,
    queryFn: () => fetchPhrasesByUserId(token!),
    enabled: !!token,
  });
}

async function fetchPhrasesByUserId(token: string) {
  try {
    const response = await axiosRequester(token).get("/phrase/");
    return phraseSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function checkIfPhraseExists(
  videoId: string,
  start: number
): Promise<boolean> {
  try {
    const token = jsCookie.get("token");
    if (!token) {
      throw new Error("Token is not found.");
    }
    const response = await axiosRequester(token).get(
      `/phrase/check_if_phrase_exists/${videoId}/${start}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

interface PhraseToCreateType {
  userId: string;
  videoId: string;
  text: string;
  start: number;
  end: number;
}

export function useCreatePhrase() {
  const token = jsCookie.get("token");

  return useMutation({
    mutationFn: (phrase: PhraseToCreateType) => {
      if (!token) {
        throw new Error("Token is not found.");
      }
      return createPhrase(token, phrase);
    },
  });
}

async function createPhrase(token: string, phrase: PhraseToCreateType) {
  try {
    const response = await axiosRequester(token).post("/phrase/", {
      ...phrase,
    });
    return phraseSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export function useDeletePhrase() {
  const token = jsCookie.get("token");

  return useMutation({
    mutationFn: (phraseId: string) => {
      if (!token) {
        throw new Error("Token is not found.");
      }
      return deletePhrase(token, phraseId);
    },
  });
}

async function deletePhrase(token: string, phraseId: string): Promise<void> {
  try {
    await axiosRequester(token).delete(`/phrase/${phraseId}/`);
  } catch (error) {
    throw error;
  }
}
