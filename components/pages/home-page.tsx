"use client";

import Image from "next/image";

import SocialLinks from "@components/home/social-links";

import styles from "@app/home.module.css";

export default function HomePageClient() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <Image
          src="/assets/avatar.png"
          alt="Twiston avatar"
          width={96}
          height={96}
          className={styles.avatar}
          priority
        />
        <h1>Twiston</h1>
        <p className={styles.subtitle}>Student software development</p>
        <SocialLinks className={styles.socialLinks} />
      </section>
    </main>
  );
}

