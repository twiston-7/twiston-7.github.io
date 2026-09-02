import type { ComponentType } from "react";

export type BackgroundId = "skyline" | "distortion" | "slimeMold" | "minimal";

export type BackgroundContext = {
  pathname: string;
  theme: "light" | "dark";
};

export type BackgroundOption = {
  id: BackgroundId;
  label: string;
  description: string;
  isApplicable?: (context: BackgroundContext) => boolean | Promise<boolean>;
  component: ComponentType;
};

export const BACKGROUND_STORAGE_KEY = "background";
export const BACKGROUND_ATTRIBUTE = "data-background";
export const BACKGROUND_CHANGE_EVENT = "backgroundchange";

const backgroundIds = new Set<BackgroundId>(["skyline", "distortion", "minimal"]);

export const isBackgroundId = (value: string | null): value is BackgroundId => {
  return value !== null && backgroundIds.has(value as BackgroundId);
};

export const getApplicableBackgroundOptions = (
  options: BackgroundOption[],
  context: BackgroundContext,
) => {
  return options.filter((option) => option.isApplicable?.(context) ?? true);
};

export const resolveBackgroundSelection = (
  currentBackground: BackgroundId | null | undefined,
  availableOptions: BackgroundOption[],
) => {
  if (currentBackground && availableOptions.some((option) => option.id === currentBackground)) {
    return currentBackground;
  }

  return availableOptions[0]?.id ?? currentBackground ?? "skyline";
};

export const getInitialBackground = (
  availableOptions: BackgroundOption[],
  rootBackground: string | null,
  storedBackground: string | null,
) => {
  if (isBackgroundId(rootBackground) && availableOptions.some((option) => option.id === rootBackground)) {
    return rootBackground;
  }

  if (isBackgroundId(storedBackground) && availableOptions.some((option) => option.id === storedBackground)) {
    return storedBackground;
  }

  return availableOptions[0]?.id ?? "skyline";
};

export const getCurrentBackground = () => {
  if (typeof document !== "undefined") {
    const rootBackground = document.documentElement.getAttribute(BACKGROUND_ATTRIBUTE);

    if (isBackgroundId(rootBackground)) {
      return rootBackground;
    }
  }

  if (typeof window !== "undefined") {
    const storedBackground = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);

    if (isBackgroundId(storedBackground)) {
      return storedBackground;
    }
  }

  return null;
};

export const subscribeToBackgroundChanges = (callback: () => void) => {
  window.addEventListener(BACKGROUND_CHANGE_EVENT, callback);

  return () => window.removeEventListener(BACKGROUND_CHANGE_EVENT, callback);
};

export const notifyBackgroundChange = () => {
  window.dispatchEvent(new Event(BACKGROUND_CHANGE_EVENT));
};

export const applyBackground = (background: BackgroundId) => {
  document.documentElement.setAttribute(BACKGROUND_ATTRIBUTE, background);
  window.localStorage.setItem(BACKGROUND_STORAGE_KEY, background);
  notifyBackgroundChange();
};
