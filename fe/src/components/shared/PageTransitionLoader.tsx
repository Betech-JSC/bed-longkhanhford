"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  // Stop progress when page/query changes
  useEffect(() => {
    if (active) {
      setProgress(100);
      const timer = setTimeout(() => {
        setActive(false);
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Crawl progress slowly towards 90% while active
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (active && progress < 90) {
      const step = () => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          // Crawl slower as it gets higher
          const diff = (90 - prev) * 0.15;
          return prev + Math.max(0.5, diff);
        });
      };
      interval = setInterval(step, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, progress]);

  // Listen to clicks on internal links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      let target = e.target as HTMLElement;
      while (target && target.tagName !== "A") {
        target = target.parentElement as HTMLElement;
      }

      if (!target || target.tagName !== "A") return;

      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href");

      // Check if it is a valid internal link and not a hash link
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        anchor.target !== "_blank" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Parse pathname and query to compare
        const currentUrl = window.location.pathname + window.location.search;
        // Resolve absolute url path if needed
        let targetUrl = href;
        try {
          const resolvedUrl = new URL(href, window.location.href);
          targetUrl = resolvedUrl.pathname + resolvedUrl.search;
        } catch {
          // Fallback to raw href
        }

        if (currentUrl !== targetUrl) {
          setVisible(true);
          setActive(true);
          setProgress(15);
        }
      }
    };

    const handlePopState = () => {
      setVisible(true);
      setActive(true);
      setProgress(15);
    };

    document.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${progress}%`,
        backgroundColor: "#0562D2", // Brand blue
        boxShadow: "0 0 10px rgba(5, 98, 210, 0.7), 0 0 5px rgba(5, 98, 210, 0.5)",
        transition: active ? "width 0.2s cubic-bezier(0.1, 0.8, 0.2, 1)" : "width 0.3s ease, opacity 0.3s ease",
        opacity: active ? 1 : 0,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    />
  );
}
