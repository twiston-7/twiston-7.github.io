"use client";

import { useSyncExternalStore } from "react";

import { BACKGROUND_OPTIONS } from "@components/backgrounds";
import Navbar from "@components/navbar/navbar";
import ThemeInit from "@components/theme-init";
import { getCurrentBackground, subscribeToBackgroundChanges } from "@lib/backgrounds";

type ClientShellProps = {
  children: React.ReactNode;
};

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ClientShell({ children }: ClientShellProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const backgroundId = useSyncExternalStore(
    subscribeToBackgroundChanges,
    () => getCurrentBackground() ?? BACKGROUND_OPTIONS[0].id,
    () => BACKGROUND_OPTIONS[0].id,
  );

  const activeBackground =
    BACKGROUND_OPTIONS.find((option) => option.id === backgroundId) ?? BACKGROUND_OPTIONS[0];
  const BackgroundComponent = activeBackground.component;

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ThemeInit />
      <BackgroundComponent />
      <Navbar />
      {children}
    </>
  );
}
