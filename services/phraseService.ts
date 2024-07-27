import { axiosRequester } from "@/services/axiosRequester";
import {
  checkIfPhraseExistsSchema,
  phraseSchema,
} from "@/schemas/phraseSchema";
import jsCookie from "js-cookie";
import { z } from "zod";

export async function fetchPhrasesByUserId() {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).get("/phrase/");
    return z.array(phraseSchema).parse(response.data);
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

export async function createPhrase(phrase: PhraseToCreateType) {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).post("/phrase/", {
      phraseToCreate: phrase,
    });
    return phraseSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function deletePhrase(phraseId: string): Promise<void> {
  const token = jsCookie.get("token");

  try {
    await axiosRequester(token).delete(`/phrase/${phraseId}/`);
  } catch (error) {
    throw error;
  }
}
