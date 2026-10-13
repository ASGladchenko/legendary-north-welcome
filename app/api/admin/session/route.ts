import { NextResponse } from "next/server";

import {
  adminBackend,
  adminCookieName,
  adminSessionCookieName,
  errorMessage,
} from "../backend";

type LoginResponse = {
  accessToken?: unknown;
  expiresAt?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password || username.length > 100 || password.length > 1024) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 },
    );
  }

  const result = await adminBackend("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const login = result.data as LoginResponse | null;
  const expiresAt =
    typeof login?.expiresAt === "string" ? new Date(login.expiresAt) : null;

  if (
    result.status >= 400 ||
    typeof login?.accessToken !== "string" ||
    !expiresAt ||
    Number.isNaN(expiresAt.getTime())
  ) {
    return NextResponse.json(
      { message: errorMessage(result.data) },
      { status: result.status >= 400 ? result.status : 502 },
    );
  }

  const response = NextResponse.json({ authenticated: true });

  response.cookies.set(adminCookieName, login.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/api/admin",
  });
  response.cookies.set(adminSessionCookieName, "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/admin",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/api/admin",
  });
  response.cookies.set(adminSessionCookieName, "", {
    maxAge: 0,
    path: "/admin",
  });

  return response;
}
