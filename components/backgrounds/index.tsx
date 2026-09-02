"use client";

import WebGLBackground from "./webgl-background";
import MinimalBackground from "./minimal-background";
import StarfieldBackground from "./starfield-background";
import type { BackgroundOption } from "@lib/backgrounds";

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: "skyline",
    label: "Skyline",
    description: "A darker starry gradient.",
    isApplicable: ({ theme }) => theme === "dark",
    component: StarfieldBackground,
  },
  {
    id: "distortion",
    label: "Distortion",
    description: "A Balatro-like animated background.",
    component: WebGLBackground,
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "A clean, low-noise backdrop.",
    component: MinimalBackground,
  },
];
