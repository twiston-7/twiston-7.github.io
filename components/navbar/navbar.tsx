"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BACKGROUND_OPTIONS } from "@components/backgrounds";
import styles from "@components/navbar/navbar.module.css";
import {
  applyBackground,
  getApplicableBackgroundOptions,
  getInitialBackground,
  resolveBackgroundSelection,
  type BackgroundId,
} from "@lib/backgrounds";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type ThemeMode = "light" | "dark";

type MenuState = {
  open: boolean;
  atPath: string;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof document !== "undefined") {
    const rootTheme = document.documentElement.getAttribute("data-theme");
    if (rootTheme === "dark" || rootTheme === "light") {
      return rootTheme;
    }
  }

  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

export default function Navbar() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState<MenuState>({ open: false, atPath: pathname });
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [backgroundMenuOpen, setBackgroundMenuOpen] = useState(false);
  const menuOpen = menuState.open && menuState.atPath === pathname;

  const isDark = theme === "dark";
  const applicableBackgrounds = useMemo(
    () => getApplicableBackgroundOptions(BACKGROUND_OPTIONS, { pathname, theme }),
    [pathname, theme],
  );

  const [background, setBackground] = useState<BackgroundId>(() => {
    if (typeof document === "undefined") {
      return applicableBackgrounds[0]?.id ?? "skyline";
    }

    const rootBackground = document.documentElement.getAttribute("data-background");
    const storedBackground = window.localStorage.getItem("background");

    return getInitialBackground(applicableBackgrounds, rootBackground, storedBackground);
  });

  const activeBackground = resolveBackgroundSelection(background, applicableBackgrounds);
  const activeBackgroundOption = applicableBackgrounds.find((option) => option.id === activeBackground);
  const backgroundSwitcherVisible = applicableBackgrounds.length > 1;

  useEffect(() => {
    applyBackground(activeBackground);
  }, [activeBackground]);

  const renderedLinks = useMemo(
    () =>
      navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink}${active ? ` ${styles.navLinkActive}` : ""}`}
            onClick={() => {
              setMenuState({ open: false, atPath: pathname });
              setBackgroundMenuOpen(false);
            }}
          >
            {item.label}
          </Link>
        );
      }),
    [pathname],
  );

  const handleThemeChange = (checked: boolean) => {
    const nextTheme: ThemeMode = checked ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleBackgroundChange = (nextBackground: BackgroundId) => {
    setBackground(nextBackground);
    applyBackground(nextBackground);
    setBackgroundMenuOpen(false);
  };

  return (
    <header className={styles.siteHeader}>
      <button
        type="button"
        className={`${styles.hamburger}${menuOpen ? ` ${styles.hamburgerActive}` : ""}`}
        aria-label="Mobile menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuState((value) => ({ open: !value.open, atPath: pathname }))}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <nav className={`${styles.siteNav}${menuOpen ? ` ${styles.siteNavOpen}` : ""}`}>
        {renderedLinks}

        <div className={styles.navActions}>
          {backgroundSwitcherVisible && (
            <div className={styles.backgroundSwitcher}>
              <button
                type="button"
                className={styles.backgroundToggle}
                aria-haspopup="menu"
                aria-expanded={backgroundMenuOpen}
                aria-controls="background-menu"
                onClick={() => setBackgroundMenuOpen((value) => !value)}
              >
                <span className={styles.backgroundToggleLabel}>Background</span>
                <span className={styles.backgroundToggleValue}>{activeBackgroundOption?.label ?? "Choose"}</span>
                <span aria-hidden="true" className={styles.backgroundToggleCaret}>
                  ▾
                </span>
              </button>

              {backgroundMenuOpen && (
                <div
                  id="background-menu"
                  className={styles.backgroundMenu}
                  role="menu"
                  aria-label="Background options"
                >
                  {applicableBackgrounds.map((option) => {
                    const active = option.id === activeBackground;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.backgroundMenuItem}${active ? ` ${styles.backgroundMenuItemActive}` : ""}`}
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => handleBackgroundChange(option.id)}
                      >
                        <span className={styles.backgroundMenuItemLabel}>{option.label}</span>
                        <span className={styles.backgroundMenuItemDescription}>{option.description}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className={styles.themeSelector}>
            <input
              id="theme-toggle"
              className={styles.themeCheckbox}
              type="checkbox"
              checked={isDark}
              onChange={(event) => handleThemeChange(event.currentTarget.checked)}
              aria-label="Toggle color theme"
            />

            <label className={styles.themeSelectorLabel} htmlFor="theme-toggle" aria-hidden="true">
              <svg
                className={`${styles.themeIcon}${isDark ? ` ${styles.visible}` : ` ${styles.invisible}`}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286" />
              </svg>

              <svg
                className={`${styles.themeIcon}${isDark ? ` ${styles.invisible}` : ` ${styles.visible}`}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
              </svg>
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
}

