import type { Metadata } from "next";
import { cookies } from "next/headers";

import { adminSessionCookieName } from "../api/admin/backend";
import { AdminNav } from "./admin-nav";
import { AdminQueryProvider } from "./admin-query-provider";
import "./admin.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const authenticated = Boolean(
    (await cookies()).get(adminSessionCookieName)?.value,
  );

  return (
    <main className={`admin-page${authenticated ? "" : " is-guest"}`}>
      <div className="admin-aurora" aria-hidden="true" />
      <AdminQueryProvider>
        {authenticated && <AdminNav />}
        <section className="admin-shell">
          <div className="admin-content">{children}</div>
        </section>
      </AdminQueryProvider>
    </main>
  );
}
