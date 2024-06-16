import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: phraseQueryKeys.phrases,
    queryFn: fetchPhrasesByUserId,
  });
}

export function useCreatePhrase() {
  return useMutation({
    mutationFn: (phrase: PhraseToCreateType) => {
      return createPhrase(phrase);
    },
  });
}

export function useDeletePhrase() {
  return useMutation({
    mutationFn: (phraseId: string) => {
      return deletePhrase(phraseId);
    },
  });
}
