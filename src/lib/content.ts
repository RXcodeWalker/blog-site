/**
 * Non-post site content.
 *
 * Articles and categories have been migrated to the MDX content pipeline.
 * See src/content/ for the new source of truth.
 *
 * This file retains only small, static constants that are not posts:
 *   - images   — asset imports used in the homepage hero / category cards
 *   - signals  — short "notebook" entries displayed in the homepage feed
 *   - obsessions — ticker items in the homepage hero
 */
import heroImg from "@/assets/hero-atmosphere.jpg";
import footballImg from "@/assets/feature-football.jpg";
import techImg from "@/assets/feature-tech.jpg";
import philoImg from "@/assets/feature-philosophy.jpg";
import readingImg from "@/assets/feature-reading.jpg";

export const images = { heroImg, footballImg, techImg, philoImg, readingImg };

export const signals = [
  {
    id: "01",
    text: "Learning in public beats waiting for perfection. Ship, reflect, improve, repeat.",
  },
  { id: "02", text: "Arsenal analysis taught me systems thinking before I knew the term." },
  { id: "03", text: "Code and football have one thing in common: structure decides outcomes." },
  { id: "04", text: "A student's edge is consistency, not intensity spikes." },
  { id: "05", text: "Build things that matter, then explain how you built them." },
];

export const obsessions = [
  "Arsenal FC",
  "Football tactics",
  "Web development",
  "Python",
  "Strategic analysis",
  "Creative coding",
  "Learning in public",
  "Continuous growth",
  "Team culture",
  "Better habits",
];
