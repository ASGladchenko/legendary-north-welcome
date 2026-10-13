import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminCookieName, adminSessionCookieName } from "./backend";

export async function adminToken() {
  return (await cookies()).get(adminCookieName)?.value;
}

export function adminAuthorized(data: unknown) {
  const response = NextResponse.json(data);

  response.cookies.set(adminSessionCookieName, "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });

  return response;
}

export function adminUnauthorized() {
  const response = NextResponse.json(
    { message: "Authentication required" },
    { status: 401 },
  );

  response.cookies.set(adminCookieName, "", { maxAge: 0, path: "/api/admin" });
  response.cookies.set(adminSessionCookieName, "", {
    maxAge: 0,
    path: "/admin",
  });

  return response;
}
