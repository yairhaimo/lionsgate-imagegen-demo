import { errorMessage, parseJson } from "./response";

export async function postForm<T>(url: string, formData: FormData) {
  const response = await fetch(url, {
    body: formData,
    method: "POST",
  });
  const payload = parseJson(await response.text());

  if (!response.ok) {
    throw new Error(errorMessage(payload));
  }

  return payload as T;
}
