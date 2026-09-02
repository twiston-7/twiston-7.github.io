export type Project = {
  id: string;
  title: string;
  kicker: string;
  subtitle: string;
  description: string;
  tech: string[];
  image: string;
  live?: string;
  repo?: string;
  access?: string;
  cta?: {
    label: string;
    href: string;
  };
};

export const projects: Project[] = [
  {
    id: "cobalt",
    title: "Cobalt",
    kicker: "Featured",
    subtitle: "A Minecraft mod written in Kotlin",
    description:
      "A quality of life mod designed for Hypixel Skyblock, including pathfinding, movement and a flexible module loader.",
    tech: ["Kotlin", "Java", "Gradle"],
    image: "/assets/cobalt-icon.png",
    repo: "https://github.com/CobaltScripts/Cobalt",
    cta: {
      label: "Discord server",
      href: "https://discord.gg/dagzgJrgu9",
    },
  },
  {
    id: "human-benchmark-solver",
    title: "Human Benchmark Solver",
    kicker: "Automation",
    subtitle: "Automation using Puppeteer",
    description:
      "Automated completion of all tasks on the Human Benchmark test using Puppeteer for browser control.",
    tech: ["Node.js", "Puppeteer"],
    image: "/assets/human-benchmark-solver.png",
    repo: "https://github.com/twiston-7/human-benchmark-solver",
  },
  {
    id: "blackjack-utils",
    title: "Modular Blackjack Statistic",
    kicker: "Statistics",
    subtitle: "A modular blackjack statistics utility",
    description:
      "Calculates the house edge for blackjack, with a modular design allowing for custom game rules to be calculated easily",
    tech: ["C++", "CMake"],
    image: "",
    repo: "https://github.com/twiston-7/blackjack-utils",
  },
  {
    id: "gwenly",
    title: "Gwenly",
    kicker: "League of Legends Utility",
    subtitle: "A League of Legends utility",
    description:
      "A work-in-progress overlay for League of Legends aiming at improving the player experience without a minor performance penalty.",
    tech: ["C++", "CMake", "ImGui"],
    image: "",
    repo: "https://github.com/twiston-7/gwenly",
  },
  {
    id: "twiston-dev",
    title: "Twiston.dev",
    kicker: "Web App",
    subtitle: "Portfolio website",
    description: "A minimalistic portfolio website.",
    tech: ["Next.js", "Typescript"],
    image: "/assets/avatar.png",
    live: "https://twiston.dev",
    repo: "https://github.com/twiston-7/twiston-7.github.io",
  },
];

