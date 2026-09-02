"use client";

import { useEffect, useRef } from "react";

import styles from "@backgrounds/starfield-background.module.css";

export default function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const createStars = () => {
      container.replaceChildren();

      let starCount = Math.floor(window.innerWidth * 0.6);
      starCount = Math.min(starCount, 1800);

      const fragment = document.createDocumentFragment();

      for (let index = 0; index < starCount; index += 1) {
        const star = document.createElement("div");
        star.className = styles.star;

        const duration = 25 + Math.random() * 40;
        const delay = index < starCount / 1.5 ? -(Math.random() * duration) : 0;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `move ${duration}s linear infinite ${delay}s, twinkle ${
          1 + Math.random() * 2
        }s ease-in-out infinite`;

        fragment.appendChild(star);
      }

      container.appendChild(fragment);
    };

    createStars();

    const handleResize = () => createStars();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className={styles.spaceBackground} aria-hidden="true" />;
}