import { axiosRequester } from "@/queries/axiosRequester";
import { checkIfUserExistsSchema, userSchema } from "@/schemas/userSchema";
import jsCookie from "js-cookie";

export async function fetchSelf() {
  const token = jsCookie.get("token");
  console.log("fetchSelf -> token", token);

  try {
    const response = await axiosRequester(token).get("/user/");
    return userSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export async function checkIfUserExists() {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).get(
      "/user/check_if_user_exists/"
    );
    return checkIfUserExistsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

export type UserToCreateType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export async function createUser(user: UserToCreateType) {
  const token = jsCookie.get("token");

  try {
    const response = await axiosRequester(token).post("/user/", {
      ...user,
    });
    return userSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
