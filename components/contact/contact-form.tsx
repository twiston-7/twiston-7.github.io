"use client";

import { useMemo, useState } from "react";

import styles from "@components/contact/contact-form.module.css";

type Notice = {
  type: "success" | "error";
  text: string;
};

type FormDataState = {
  name: string;
  email: string;
  topic: string;
  message: string;
  honeypot: string;
};

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          size: "invisible";
          callback: (token: string) => void;
        },
      ) => number;
      execute: (widgetId: number) => void;
      reset: (widgetId: number) => void;
    };
  }
}

const maxChars = 1500;
const topics = ["Internship", "Project idea", "Collaboration", "Other"];

const initialForm: FormDataState = {
  name: "",
  email: "",
  topic: "",
  message: "",
  honeypot: "",
};

export default function ContactForm() {
  const [data, setData] = useState<FormDataState>(initialForm);
  const [notice, setNotice] = useState<Notice | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("sent") === "1"
      ? { type: "success", text: "Thanks - message sent." }
      : null;
  });
  const [sending, setSending] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);

  const charCount = data.message.length;


  const deobfuscate = useMemo(
    () =>
      (value: string) => {
        try {
          const decoded = atob(value);
          return decoded.split("").reverse().join("");
        } catch {
          return "";
        }
      },
    [],
  );

  const ensureRecaptcha = async () => {
    const root = document.getElementById("recaptcha-root");
    if (!root) {
      return null;
    }

    if (!window.grecaptcha) {
      return new Promise<number | null>((resolve) => {
        const interval = window.setInterval(() => {
          if (window.grecaptcha) {
            window.clearInterval(interval);
            resolve(ensureRecaptcha());
          }
        }, 120);

        window.setTimeout(() => {
          window.clearInterval(interval);
          resolve(null);
        }, 8000);
      });
    }

    if (widgetId !== null) {
      return widgetId;
    }

    const id = window.grecaptcha.render(root, {
      sitekey: "6LeLzNMrAAAAAHlsi_CGxKHHLaObG3fag9LtkUeL",
      size: "invisible",
      callback: (token) => {
        void submitToApi(token);
      },
    });

    setWidgetId(id);
    return id;
  };

  const validate = () => {
    if (!data.name.trim() || !data.email.trim() || !data.topic || !data.message.trim()) {
      setNotice({ type: "error", text: "Please fill in all fields." });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      setNotice({ type: "error", text: "Please enter a valid email address." });
      return false;
    }

    if (data.message.length > maxChars) {
      setNotice({ type: "error", text: `Message is too long. Please keep it under ${maxChars} characters.` });
      return false;
    }

    return true;
  };

  const submitToApi = async (token: string) => {
    const key = deobfuscate("OTdmbWNrbWIwajcxODRqa243bG1oMWVtX2Zz");
    if (!key) {
      setNotice({ type: "error", text: "Form is not configured with an API key." });
      setSending(false);
      return;
    }

    const params = new URLSearchParams();
    params.set("name", data.name.trim());
    params.set("email", data.email.trim());
    params.set("topic", data.topic.trim());
    params.set("message", data.message.trim());
    params.set("subject", `Portfolio Contact: ${data.topic} - ${data.name}`);
    params.set("replyTo", data.email.trim());
    params.set("honeypot", data.honeypot);
    params.set("g-recaptcha-response", token);
    params.set("apiKey", key);
    params.set("accessKey", key);

    try {
      const response = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: params.toString(),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string; errors?: string[] }
        | null;

      if (response.ok) {
        setData(initialForm);
        const url = new URL(window.location.href);
        url.search = "?sent=1";
        window.location.replace(url.toString());
        return;
      }

      const message =
        payload?.message ?? payload?.error ?? payload?.errors?.join(", ") ?? "An error occurred. Please try again.";
      setNotice({ type: "error", text: message });
      if (widgetId !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetId);
      }
    } catch {
      setNotice({ type: "error", text: "Network error. Please try again." });
      if (widgetId !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetId);
      }
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sending) {
      return;
    }

    if (!validate()) {
      return;
    }

    setNotice(null);
    setSending(true);
    const id = await ensureRecaptcha();

    if (id === null || !window.grecaptcha) {
      setSending(false);
      setNotice({ type: "error", text: "reCAPTCHA is not ready. Please try again." });
      return;
    }

    window.grecaptcha.execute(id);
  };

  return (
    <>
      <header className={styles.contactHeader}>
        <h1>Contact</h1>
        <div
          className={`${styles.notice}${notice ? ` ${notice.type === "success" ? styles.noticeSuccess : styles.noticeError}` : ""}`}
          role="status"
          aria-live="polite"
          hidden={!notice}
        >
          {notice?.text}
        </div>
      </header>

      <section className={styles.contactGrid}>
        <form className={styles.card} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.control}
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={data.name}
              onChange={(event) => setData((value) => ({ ...value, name: event.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.control}
              autoComplete="email"
              placeholder="ada@example.com"
              value={data.email}
              onChange={(event) => setData((value) => ({ ...value, email: event.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="topic">Topic</label>
            <select
              id="topic"
              name="topic"
              className={styles.control}
              value={data.topic}
              onChange={(event) => setData((value) => ({ ...value, topic: event.target.value }))}
              required
            >
              <option value="" disabled>
                Select a topic
              </option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              className={`${styles.control} ${styles.textarea}`}
              rows={7}
              placeholder="Write the details here..."
              value={data.message}
              onChange={(event) => setData((value) => ({ ...value, message: event.target.value }))}
              required
            />
            <div className={styles.meta}>
              <span className={charCount > maxChars ? styles.charCountOver : undefined}>{`${charCount}/${maxChars}`}</span>
            </div>
          </div>

          <input
            type="text"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            className={styles.hidden}
            value={data.honeypot}
            onChange={(event) => setData((value) => ({ ...value, honeypot: event.target.value }))}
          />

          <div id="recaptcha-root" className={styles.hidden} />

          <button className={styles.sendBtn} type="submit" aria-busy={sending} disabled={sending}>
            {sending ? "Sending..." : "Submit"}
          </button>

          <p className={styles.disclaimer}>This form uses Static Forms with reCAPTCHA.</p>
        </form>

        <aside className={`${styles.card} ${styles.info}`}>
          <h2>Reach out</h2>
          <ul>
            <li>Recipient: twiston7@proton.me</li>
            <li>Hours: 09:00-17:30 CET (Mon-Fri)</li>
            <li>Response: usually within 1-2 business days</li>
          </ul>
          <p className={styles.tip}>Tip: include scope, timeline, and preferred stack for faster replies.</p>
        </aside>
      </section>
    </>
  );
}

