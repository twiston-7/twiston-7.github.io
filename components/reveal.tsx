"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  revealClassName: string;
  visibleClassName: string;
};

export default function Reveal({
  children,
  className,
  revealClassName,
  visibleClassName,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      element.classList.add(visibleClassName);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add(visibleClassName);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [visibleClassName]);

  return (
    <div ref={ref} className={`${className ?? ""} ${revealClassName}`.trim()}>
      {children}
    </div>
  );
}
