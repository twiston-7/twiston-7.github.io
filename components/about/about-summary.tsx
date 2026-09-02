"use client";

import { useState } from "react";

type AboutSummaryProps = {
  text: string;
  classes: {
    summaryQuick: string;
    bullets: string;
    bulletsTight: string;
    summaryContent: string;
    expanded: string;
    summaryToggle: string;
  };
};

export default function AboutSummary({ text, classes }: AboutSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const collapsedText = paragraphs.join("\n");

  return (
    <>
      <div className={classes.summaryQuick} aria-label="Quick summary">
        <ul className={`${classes.bullets} ${classes.bulletsTight}`}>
          <li>
            <strong>Backend focus:</strong> Fluent at Java & Kotlin, with basic c++ skills.
          </li>
          <li>
            <strong>Learning:</strong> C++
          </li>
          <li>
            <strong>Workflow:</strong> reviews, testing, iterative delivery.
          </li>
          <li>
            <strong>Interest:</strong> security-minded, clear communication.
          </li>
        </ul>
      </div>

      <div className={`${classes.summaryContent}${expanded ? ` ${classes.expanded}` : ""}`}>
        {expanded ? (
          paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
        ) : (
          <p>{collapsedText}</p>
        )}
      </div>

      <button
        type="button"
        className={classes.summaryToggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </>
  );
}
