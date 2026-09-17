"use client";

import Image from "next/image";
import { FaCode, FaEnvelope, FaGithub, FaLocationDot } from "react-icons/fa6";

import AboutSummary from "@components/about/about-summary";
import Reveal from "@components/reveal";

import styles from "@app/about/page.module.css";

const text =
  "Hi! My name is Nick. I'm a software developer in my final year of university.\n" +
  "Based in the Netherlands, with a backend focus using primarily Java and Kotlin.\n" +
  "I started programming with Scratch when I was 8 years old.\n" +
  "Currently, I have 5 years of experience with Java and 3 years of experience with Kotlin.\n" +
  "Whilst I value creativity in solutions, it should always serve a practical purpose.\n" +
  "I'm currently learning C++ using CMake and ImGui for Windows development.\n" +
  "I speak both Dutch and English at a native level and am interested in learning German.\n"

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
            <FaCode /> Java - Kotlin
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
            <li>JUnit</li>
            <li>Git</li>
            <li>Scrum</li>
            <li>BML Loop</li>
            <li>Security-first</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h3>Currently learning</h3>
          <ul className={styles.chips}>
            <li>C++</li>
            <li>CMake</li>
            <li>ImGui</li>
            <li>Vulkan</li>
            <li>WinAPI</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h3>Values</h3>
          <ul className={styles.bullets}>
            <li>Practical creativity</li>
            <li>Iterative and incremental development</li>
            <li>Security-minded engineering</li>
            <li>Clear, straightforward communication</li>
          </ul>
        </article>
      </Reveal>
    </main>
  );
}


