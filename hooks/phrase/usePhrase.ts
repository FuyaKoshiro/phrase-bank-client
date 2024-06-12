import { useMutation, useQuery } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import {
  createPhrase,
  deletePhrase,
  fetchPhrasesByUserId,
  PhraseToCreateType,
} from "@/services/phraseService";

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
