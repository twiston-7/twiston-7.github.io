"use client";

import ProjectsScroller from "@components/projects/projects-scroller";
import type { Project } from "@lib/projects";

type ProjectsPageClientProps = {
  projects: Project[];
};

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  return <ProjectsScroller projects={projects} />;
}

