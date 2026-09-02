"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const theme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return null;
}

