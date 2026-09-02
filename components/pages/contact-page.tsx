"use client";

import Script from "next/script";

import ContactForm from "@components/contact/contact-form";

import styles from "@components/pages/contact-page.module.css";

export default function ContactPageClient() {
  return (
    <main className={styles.contact}>
      <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" />
      <ContactForm />
    </main>
  );
}

