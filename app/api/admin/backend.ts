import "server-only";

export const adminCookieName = "legendary_north_admin";
export const adminSessionCookieName = "legendary_north_admin_session";

const apiBaseUrl = (
  process.env.LEGENDARY_NORTH_API_URL ?? "http://127.0.0.1:4000"
).replace(/\/$/, "");

export async function backendRequest(
  path: string,
  init: RequestInit = {},
  token?: string,
) {
  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${apiBaseUrl}/api${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await response.json().catch(() => null)) as unknown;

    return { data, status: response.status };
  } catch {
    return {
      data: { message: "Admin API is unavailable" },
      status: 502,
    };
  }
}

export function adminBackend(
  path: string,
  init: RequestInit = {},
  token?: string,
) {
  return backendRequest(`/admin${path}`, init, token);
}

export function oracleToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.LEGENDARY_NORTH_TIMEZONE ?? "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function isOracleDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function errorMessage(data: unknown) {
  if (!data || typeof data !== "object") return "Request failed";

  const message = (data as { message?: unknown }).message;

  if (typeof message === "string") return message;
  if (Array.isArray(message) && message.every((item) => typeof item === "string")) {
    return message.join(". ");
  }

  return "Request failed";
}
