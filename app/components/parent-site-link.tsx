"use client";

import { useEffect, useRef, type ComponentProps } from "react";

let didLogReferrer = false;

type ParentSiteLinkProps = Omit<ComponentProps<"a">, "href" | "ref" | "target"> & {
  href: string;
};

export function getParentSiteHref(href: string) {
  if (window.self === window.top || !document.referrer) return href;

  try {
    const target = new URL(href, window.location.origin);
    const parentOrigin = new URL(document.referrer).origin;

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
    if (!didLogReferrer) {
      console.log("[welcome] document.referrer:", document.referrer || "(empty)");
      didLogReferrer = true;
    }

    const link = linkRef.current;
    if (link) link.href = getParentSiteHref(href);
  }, [href]);

  return <a {...props} ref={linkRef} href={href} target="_top" />;
}
