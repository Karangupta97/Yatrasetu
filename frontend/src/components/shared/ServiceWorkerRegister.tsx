"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((r) => console.log("[YatraSetu SW] registered, scope:", r.scope))
          .catch((e) => console.warn("[YatraSetu SW] registration failed:", e));
      });
    }
  }, []);

  return null;
}
