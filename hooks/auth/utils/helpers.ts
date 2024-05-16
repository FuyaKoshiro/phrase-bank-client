import jsCookie from "js-cookie";

export function setCookie(key: string, value: string | undefined) {
  if (!value) return;
  jsCookie.set(key, value);
}
