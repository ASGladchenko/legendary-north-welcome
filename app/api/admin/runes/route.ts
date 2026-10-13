import { NextResponse } from "next/server";

import { adminAuthorized, adminToken, adminUnauthorized } from "../auth";
import {
  adminBackend,
  errorMessage,
  isOracleDate,
  oracleToday,
} from "../backend";

export async function GET(request: Request) {
  const accessToken = await adminToken();

  if (!accessToken) return adminUnauthorized();

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const requestedDate = searchParams.get("date");
  const date = requestedDate ?? oracleToday();

  if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ message: "Invalid month" }, { status: 400 });
  }
  if (!month && !isOracleDate(date)) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  // ponytail: replace the all-record query when the backend supports date ranges.
  const query = new URLSearchParams(
    month ? { segment: "core" } : { date, segment: "core" },
  );
  const result = await adminBackend(`/rune-cores?${query}`, {}, accessToken);

  if (result.status === 401) return adminUnauthorized();
  if (result.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(result.data) },
      { status: result.status },
    );
  }

  const runes = Array.isArray(result.data) ? result.data : [];

  if (month) {
    return adminAuthorized({
      month,
      today: oracleToday(),
      runes: runes.filter(
        (core) =>
          core &&
          typeof core === "object" &&
          typeof (core as { date?: unknown }).date === "string" &&
          (core as { date: string }).date.startsWith(month),
      ),
    });
  }

  return adminAuthorized({ date, runes });
}
