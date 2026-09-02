"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Project } from "@lib/projects";

import styles from "@components/projects/projects-scroller.module.css";

type ProjectsScrollerProps = {
  projects: Project[];
};

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function ProjectsScroller({ projects }: ProjectsScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const ids = useMemo(() => projects.map((project) => project.id), [projects]);

  const scrollToIndex = (index: number) => {
    const scroller = scrollRef.current;
    if (!scroller) {
      return;
    }

    const clamped = Math.min(Math.max(index, 0), projects.length - 1);
    const target = scroller.querySelector<HTMLElement>(`[data-slide-id="${ids[clamped]}"]`);
    if (!target) {
      return;
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const startTop = scroller.scrollTop;
    const endTop = target.offsetTop;
    const distance = endTop - startTop;

    if (distance === 0) {
      return;
    }

    const duration = 500; // ms
    const startTime = performance.now();

    // Native smooth scrollTo gets short-circuited into a jump by some
    // browsers (Firefox/Floorp included) when scroll-snap-type: mandatory
    // is active, so we drive scrollTop manually instead. Snap is turned
    // off for the duration so it can't fight the animation, then restored.
    scroller.style.scrollSnapType = "none";

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);

      scroller.scrollTop = startTop + distance * eased;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
        scroller.style.scrollSnapType = "";
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) {
      return;
    }

    const slides = Array.from(scroller.querySelectorAll<HTMLElement>("[data-slide-id]"));
    if (slides.length === 0) {
      return;
    }

    const updateActiveByPosition = () => {
      const top = scroller.scrollTop;
      let nearest = 0;
      let smallest = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetTop - top);
        if (distance < smallest) {
          smallest = distance;
          nearest = index;
        }
      });

      setActiveIndex(nearest);
      activeIndexRef.current = nearest;
    };

    updateActiveByPosition();
    scroller.addEventListener("scroll", updateActiveByPosition, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", updateActiveByPosition);
    };
  }, [ids]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      event.preventDefault();

      const next =
        event.key === "ArrowDown" ? activeIndexRef.current + 1 : activeIndexRef.current - 1;
      scrollToIndex(next);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ids, projects.length]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <main className={styles.projectsApp}>
      <div ref={scrollRef} className={styles.projectsScroll} aria-label="Projects">
        {projects.map((project) => {
          const hasLive = Boolean(project.live);
          const hasRepo = Boolean(project.repo);

          return (
            <section
              key={project.id}
              className={styles.projectSlide}
              data-slide-id={project.id}
              aria-label={project.title}
            >
              <div className={styles.projectMedia}>
                <Image src={project.image} alt={`${project.title} preview`} fill sizes="(max-width: 56.25rem) 100vw, 60vw" />
              </div>

              <div className={styles.projectContent}>
                <div className={styles.projectKicker}>{project.kicker}</div>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <div className={styles.projectSubtitle}>{project.subtitle}</div>
                <p className={styles.projectDesc}>{project.description}</p>

                <div className={styles.projectTech}>
                  {project.tech.map((item) => (
                    <span key={item} className={styles.projectTag}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className={styles.projectActions}>
                  {hasLive ? (
                    <a className={`${styles.btn} ${styles.btnPrimary}`} href={project.live} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  ) : project.cta ? (
                    <a className={`${styles.btn} ${styles.btnPrimary}`} href={project.cta.href} target="_blank" rel="noreferrer">
                      {project.cta.label}
                    </a>
                  ) : (
                    <span className={`${styles.btn} ${styles.btnGhost} ${styles.btnIsDisabled}`}>Demo N/A</span>
                  )}

                  {hasRepo ? (
                    <a className={`${styles.btn} ${styles.btnGhost}`} href={project.repo} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  ) : (
                    <span className={`${styles.btn} ${styles.btnGhost} ${styles.btnIsDisabled}`}>{project.access ?? "Private code"}</span>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <nav className={styles.projectsRail} aria-label="Project navigation">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className={styles.segment}
            aria-label={project.title}
            aria-current={activeIndex === index}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </nav>
    </main>
  );
}
