import type { Metadata } from "next";

import { AdminPanel } from "./admin-panel";

export const metadata: Metadata = {
  title: "Oracle Admin | Legendary North",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { passwordChanged } = await searchParams;

  return (
    <AdminPanel
      notice={
        passwordChanged === "1"
          ? "Password changed. Sign in with your new password."
          : undefined
      }
    />
  );
}
