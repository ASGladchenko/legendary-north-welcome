"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { adminRequest } from "./admin-api";

const links = [
  { href: "/admin", label: "OpenAI settings", exact: true },
  { href: "/admin/runes", label: "Horoscope calendar", exact: false },
  { href: "/admin/password", label: "Change password", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const logout = useMutation({
    mutationFn: () =>
      adminRequest("/api/admin/session", { method: "DELETE" }),
    onSuccess: () => {
      queryClient.clear();
      router.replace("/admin");
      router.refresh();
    },
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        className="admin-menu-toggle"
        type="button"
        aria-controls="admin-navigation"
        aria-expanded={open}
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <i />
        <i />
        <i />
      </button>
      <button
        className={`admin-nav-backdrop${open ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setOpen(false)}
      />
      <aside
        id="admin-navigation"
        className={`admin-nav${open ? " is-open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="admin-nav-heading">
          <div>
            <span>Legendary North</span>
            <strong>Admin</strong>
          </div>
          <button
            className="admin-nav-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <span className="admin-kicker">Navigation</span>
        <nav>
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                className={active ? "is-active" : ""}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                <i aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="admin-sign-out"
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
      </aside>
    </>
  );
}
