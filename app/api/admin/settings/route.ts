import { NextResponse } from "next/server";

import { isOpenAIModel } from "@/app/config/openai-models";

import { adminAuthorized, adminToken, adminUnauthorized } from "../auth";
import { adminBackend, errorMessage } from "../backend";

export async function GET() {
  const accessToken = await adminToken();

  if (!accessToken) return adminUnauthorized();

  const result = await adminBackend("/settings", {}, accessToken);

  if (result.status === 401) return adminUnauthorized();
  if (result.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(result.data) },
      { status: result.status },
    );
  }

  return adminAuthorized(result.data);
}

export async function PUT(request: Request) {
  const accessToken = await adminToken();

  if (!accessToken) return adminUnauthorized();

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  const model = typeof body?.model === "string" ? body.model.trim() : "";

  if (
    apiKey.length < 16 ||
    apiKey.length > 512 ||
    !isOpenAIModel(model)
  ) {
    return NextResponse.json(
      { message: "Enter a valid API key and select a supported model" },
      { status: 400 },
    );
  }

  const result = await adminBackend(
    "/settings/openai",
    {
      method: "PUT",
      body: JSON.stringify({ apiKey, model }),
    },
    accessToken,
  );

  if (result.status === 401) return adminUnauthorized();
  if (result.status >= 400) {
    return NextResponse.json(
      { message: errorMessage(result.data) },
      { status: result.status },
    );
  }

  return adminAuthorized(result.data);
}
