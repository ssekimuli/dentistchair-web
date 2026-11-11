import axios from "axios";

export const WAITING_LIST_URL = "https://onboarddental.poslycloud.com/api/waiting-list";

export type WaitingListPayload = {
  client_email: string;
  phone: string;
  location?: string;
  branch?: string;
};

export type WaitingListResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

type WaitingListBody = { message?: string; errors?: Record<string, string[]> };

const GENERIC_ERROR = "Something went wrong. Please try again in a moment.";

export async function joinWaitingList(payload: WaitingListPayload): Promise<WaitingListResult> {
  let response;
  try {
    response = await axios.post<WaitingListBody>(WAITING_LIST_URL, payload, {
      headers: { Accept: "application/json" },
      // Return every HTTP status as a response so each case below handles it,
      // instead of axios throwing on non-2xx.
      validateStatus: () => true,
    });
  } catch {
    // Network failure or CORS block.
    return { ok: false, message: GENERIC_ERROR };
  }

  const body = response.data ?? {};

  switch (response.status) {
    case 202:
      return {
        ok: true,
        message: body.message ?? "Thank you. You have been added to the waiting list.",
      };
    case 422:
      return {
        ok: false,
        message: body.message ?? "Please check the details and try again.",
        fieldErrors: body.errors,
      };
    case 429:
      return {
        ok: false,
        message: "Too many requests from your connection. Please wait a few minutes and try again.",
      };
    default:
      return { ok: false, message: GENERIC_ERROR };
  }
}
