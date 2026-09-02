import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

import AboutPageClient from "@components/pages/about-page";

export default function AboutPage() {
  return <AboutPageClient />;
}
