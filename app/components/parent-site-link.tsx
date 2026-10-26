"use client";

import { useEffect, useRef, type ComponentProps } from "react";

let didLogParentUrl = false;

type ParentSiteLinkProps = Omit<ComponentProps<"a">, "href" | "ref" | "target"> & {
  href: string;
};

function getParentSiteOrigin() {
  if (window.self === window.top) return null;

  const ancestorOrigins = window.location.ancestorOrigins;
  const ancestorOrigin = ancestorOrigins?.item(ancestorOrigins.length - 1);
  if (ancestorOrigin) return ancestorOrigin;

  try {
    return document.referrer ? new URL(document.referrer).origin : null;
  } catch {
    return null;
  }
}

export function getParentSiteHref(href: string) {
  try {
    const target = new URL(href, window.location.origin);
    const parentOrigin = getParentSiteOrigin();

    if (!parentOrigin) return href;

    return new URL(
      `${target.pathname}${target.search}${target.hash}`,
      parentOrigin,
    ).href;
  } catch {
    return href;
  }
}

export function ParentSiteLink({ href, ...props }: ParentSiteLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!didLogParentUrl) {
      let parentUrl = document.referrer || getParentSiteOrigin();

      try {
        if (window.self !== window.top) parentUrl = window.top!.location.href;
      } catch {}

      console.log("[welcome] parent URL:", parentUrl || "(unavailable)");
      didLogParentUrl = true;
    }

    const link = linkRef.current;
    if (link) link.href = getParentSiteHref(href);
  }, [href]);

  return <a {...props} ref={linkRef} href={href} target="_top" />;
}
