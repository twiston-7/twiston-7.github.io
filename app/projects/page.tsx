import type { Metadata } from "next";

import ProjectsPageClient from "@components/pages/projects-page";

import { projects } from "@lib/projects";

export const metadata: Metadata = {
  title: "Projects",
};


export default function ProjectsPage() {
  return <ProjectsPageClient projects={projects} />;
}
