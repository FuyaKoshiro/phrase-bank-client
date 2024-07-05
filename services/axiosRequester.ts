import axios from "axios";

export function axiosRequester(token?: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    },
  });
}
