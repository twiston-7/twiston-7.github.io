"use client";

import Image from "next/image";
import { FaCode, FaEnvelope, FaGithub, FaLocationDot } from "react-icons/fa6";

import AboutSummary from "@components/about/about-summary";
import Reveal from "@components/reveal";

import styles from "@app/about/page.module.css";

const text =
  "I'm Nick, an HBO-ICT student studying software development, in my final year.\n" +
  "Based in the Netherlands, I have a strong backend focus using Java and Kotlin.\n" +
  "I care about delivering clean, maintainable and stable code instead of focussing purely on optimisation or eye candy.\n" +
  "I'm currently learning C++ and Vulkan.\n" +
  "I speak both Dutch and English at a native level, with Dutch being my native language.\n" +
  "Project highlights and code are on the Projects tab or on my GitHub page.\n"

export default function AboutPageClient() {
  return (
    <main className={styles.about}>
      <Reveal className={styles.aboutHero} revealClassName={styles.reveal} visibleClassName={styles.revealVisible}>
        <Image src="/assets/avatar.png" alt="Nick avatar" width={96} height={96} className={styles.avatar} priority />
        <h1>About Nick</h1>
        <p className={styles.tagline}>Student software developer</p>

        <div className={styles.meta}>
          <span className={styles.chip}>
            <FaLocationDot /> Netherlands
          </span>
          <span className={styles.chip}>
            <FaCode /> Java - Kotlin - Web
          </span>
        </div>

        <div className={styles.links}>
          <a href="mailto:twiston7@proton.me" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://github.com/twiston-7" target="_blank" rel="noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
      </Reveal>

      <Reveal className={styles.prose} revealClassName={styles.reveal} visibleClassName={styles.revealVisible}>
        <h2>Summary</h2>
        <AboutSummary
          text={text}
          classes={{
            summaryQuick: styles.summaryQuick,
            bullets: styles.bullets,
            bulletsTight: styles.bulletsTight,
            summaryContent: styles.summaryContent,
            expanded: styles.expanded,
            summaryToggle: styles.summaryToggle,
          }}
        />
      </Reveal>

      <Reveal className={styles.grid} revealClassName={styles.reveal} visibleClassName={styles.revealVisible}>
        <article className={styles.card} id="highlights">
          <h3>Core skills</h3>
          <ul className={styles.chips}>
            <li>Java</li>
            <li>Kotlin</li>
            <li>Git</li>
            <li>JUnit</li>
            <li>Scrum</li>
            <li>JavaScript</li>
            <li>HTML</li>
            <li>CSS</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h3>Currently learning</h3>
          <ul className={styles.chips}>
            <li>C# / .NET</li>
            <li>C / C++ (exploring)</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h3>Values</h3>
          <ul className={styles.bullets}>
            <li>Simplicity and readability over cleverness</li>
            <li>Code reviews, testing, and iterative delivery</li>
            <li>Security-minded engineering</li>
            <li>Clear, straightforward communication</li>
          </ul>
        </article>
      </Reveal>
    </main>
  );
}


