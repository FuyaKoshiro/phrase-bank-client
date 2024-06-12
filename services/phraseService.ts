import { axiosRequester } from "@/hooks/axiosRequester";
import {
  checkIfPhraseExistsSchema,
  phraseSchema,
} from "@/schemas/phraseSchema";
import jsCookie from "js-cookie";

export async function fetchPhrasesByUserId(token: string) {
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
    return checkIfPhraseExistsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export type PhraseToCreateType = {
  userId: string;
  videoId: string;
  text: string;
  start: number;
  end: number;
};

export async function createPhrase(token: string, phrase: PhraseToCreateType) {
  try {
    const response = await axiosRequester(token).post("/phrase/", {
      ...phrase,
    });
    return phraseSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function deletePhrase(
  token: string,
  phraseId: string
): Promise<void> {
  try {
    await axiosRequester(token).delete(`/phrase/${phraseId}/`);
  } catch (error) {
    throw error;
  }
}
