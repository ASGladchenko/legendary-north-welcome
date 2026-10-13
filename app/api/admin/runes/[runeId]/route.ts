import { NextResponse } from "next/server";

import {
  adminAuthorized,
  adminToken,
  adminUnauthorized,
} from "../../auth";
import {
  adminBackend,
  backendRequest,
  errorMessage,
  isOracleDate,
  oracleToday,
} from "../../backend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ runeId: string }> },
) {
  const accessToken = await adminToken();

  if (!accessToken) return adminUnauthorized();

  const { runeId } = await params;

  if (!/^[a-z0-9-]+$/.test(runeId)) {
    return NextResponse.json({ message: "Invalid rune" }, { status: 400 });
  }

  const requestedDate = new URL(request.url).searchParams.get("date");
  const date = requestedDate ?? oracleToday();

  if (!isOracleDate(date)) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }
  const coreQuery = new URLSearchParams({ date, runeId, segment: "core" });
  const forecastQuery = new URLSearchParams({ date, runeId });
  const [coreResult, forecastResult] = await Promise.all([
    adminBackend(`/rune-cores?${coreQuery}`, {}, accessToken),
    backendRequest(`/oracle/forecast?${forecastQuery}`),
  ]);

  if (coreResult.status === 401) return adminUnauthorized();
  if (coreResult.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(coreResult.data) },
      { status: coreResult.status },
    );
  }
  if (forecastResult.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(forecastResult.data) },
      { status: forecastResult.status },
    );
  }

  const cores = Array.isArray(coreResult.data) ? coreResult.data : [];

  if (!cores[0]) {
    return NextResponse.json(
      { message: "Rune core is not available for the selected date" },
      { status: 404 },
    );
  }

  const publicForecast = forecastResult.data as {
    rune?: unknown;
    forecast?: unknown;
  } | null;

  if (
    !publicForecast ||
    !publicForecast.rune ||
    !publicForecast.forecast ||
    typeof publicForecast.rune !== "object" ||
    typeof publicForecast.forecast !== "object" ||
    Array.isArray(publicForecast.rune) ||
    Array.isArray(publicForecast.forecast)
  ) {
    return NextResponse.json(
      { message: "Oracle API returned an invalid forecast" },
      { status: 502 },
    );
  }

  return adminAuthorized({
    date,
    core: cores[0],
    rune: publicForecast.rune,
    forecast: publicForecast.forecast,
  });
}
