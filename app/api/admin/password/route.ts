import { NextResponse } from "next/server";

import { adminToken, adminUnauthorized } from "../auth";
import {
  adminBackend,
  adminCookieName,
  adminSessionCookieName,
  errorMessage,
} from "../backend";

export async function POST(request: Request) {
  const accessToken = await adminToken();

  if (!accessToken) return adminUnauthorized();

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const confirmation =
    typeof body?.confirmation === "string" ? body.confirmation : "";

  if (!currentPassword || currentPassword.length > 1024) {
    return NextResponse.json(
      { message: "Current password is required" },
      { status: 400 },
    );
  }
  if (newPassword.length < 12 || newPassword.length > 1024) {
    return NextResponse.json(
      { message: "New password must contain at least 12 characters" },
      { status: 400 },
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { message: "New password must be different from the current password" },
      { status: 400 },
    );
  }
  if (newPassword !== confirmation) {
    return NextResponse.json(
      { message: "Password confirmation does not match" },
      { status: 400 },
    );
  }

  const result = await adminBackend(
    "/change-password",
    {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    },
    accessToken,
  );

  if (result.status === 401) {
    const message = errorMessage(result.data);

    if (message === "Current password is invalid") {
      return NextResponse.json({ message }, { status: 400 });
    }
    return adminUnauthorized();
  }
  if (result.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(result.data) },
      { status: result.status },
    );
  }

  const response = NextResponse.json({ changed: true });

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
