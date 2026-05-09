import heroImg from "@/assets/hero-atmosphere.jpg";
import footballImg from "@/assets/feature-football.jpg";
import techImg from "@/assets/feature-tech.jpg";
import philoImg from "@/assets/feature-philosophy.jpg";
import readingImg from "@/assets/feature-reading.jpg";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  read: number;
  date: string;
  author: string;
  cover: string;
  tag?: "Essay" | "Analysis" | "Signal" | "Note" | "Series";
};

export const images = { heroImg, footballImg, techImg, philoImg, readingImg };

export const categories = [
  { slug: "football", name: "Football", count: 24, accent: "75 12%", desc: "Tactics as language. Geometry, pressing schemes, and the choreography of elite teams." },
  { slug: "technology", name: "Technology", count: 31, accent: "245 18%", desc: "Beyond the noise. Infrastructure, primitives, and the long arc of computing." },
  { slug: "systems", name: "Systems", count: 18, accent: "185 14%", desc: "How complex things behave. Feedback loops, emergence, and second-order effects." },
  { slug: "philosophy", name: "Philosophy", count: 22, accent: "30 12%", desc: "First principles, ancient and modern. The examined life, examined." },
  { slug: "learning", name: "Learning", count: 14, accent: "120 10%", desc: "Compounding knowledge. Notes on attention, memory, and deliberate practice." },
  { slug: "design", name: "Design", count: 17, accent: "320 12%", desc: "Form following function following intent. The discipline of craft." },
  { slug: "ai", name: "AI", count: 26, accent: "270 18%", desc: "Models, agents, and the new substrate of cognition." },
  { slug: "signal", name: "Signal Logs", count: 42, accent: "0 0%", desc: "Short transmissions. Quotes, fragments, and what's worth your attention this week." },
];

export const articles: Article[] = [
  {
    slug: "the-geometry-of-pressing",
    title: "The Geometry of Pressing",
    dek: "Why Klopp's gegenpress is less about running and more about the mathematics of compressed space.",
    category: "Football",
    read: 14,
    date: "Nov 2025",
    author: "K. Mensah",
    cover: footballImg,
    tag: "Analysis",
  },
  {
    slug: "models-as-substrate",
    title: "Models as Substrate",
    dek: "Large models are not products — they are the new soil. What grows on top is the question that matters.",
    category: "AI",
    read: 22,
    date: "Nov 2025",
    author: "K. Mensah",
    cover: techImg,
    tag: "Essay",
  },
  {
    slug: "the-quiet-discipline",
    title: "The Quiet Discipline",
    dek: "Marcus Aurelius wrote at night by lamplight. A meditation on presence in an age of broadcast.",
    category: "Philosophy",
    read: 9,
    date: "Oct 2025",
    author: "K. Mensah",
    cover: philoImg,
    tag: "Essay",
  },
  {
    slug: "feedback-loops-everywhere",
    title: "Feedback Loops, Everywhere You Look",
    dek: "Once you see the loop, you cannot unsee it. A field guide to the hidden architecture of cause and effect.",
    category: "Systems",
    read: 18,
    date: "Oct 2025",
    author: "K. Mensah",
    cover: techImg,
    tag: "Series",
  },
  {
    slug: "reading-as-architecture",
    title: "Reading as Architecture",
    dek: "What you read becomes the floor plan of your thinking. Choose your books like you'd choose your foundations.",
    category: "Learning",
    read: 11,
    date: "Sep 2025",
    author: "K. Mensah",
    cover: readingImg,
    tag: "Note",
  },
  {
    slug: "the-false-economy-of-speed",
    title: "The False Economy of Speed",
    dek: "Why the cult of velocity in software is producing cathedrals of debt — and what to do instead.",
    category: "Technology",
    read: 16,
    date: "Sep 2025",
    author: "K. Mensah",
    cover: techImg,
    tag: "Essay",
  },
];

export const signals = [
  { id: "01", text: "Pep is no longer pressing high. The reasons reveal a tactical thesis about the modern game." },
  { id: "02", text: "On reading Borges in a year of language models." },
  { id: "03", text: "A note on Christopher Alexander's pattern language and why it predicted React." },
  { id: "04", text: "The most underrated player in Europe is a 22-year-old defensive midfielder you haven't heard of." },
  { id: "05", text: "Three books that changed how I think about attention." },
];

export const obsessions = [
  "Positional play", "Latent space", "Stoic praxis", "Compounding", "Brutalist UI", "Long tails",
  "Verlässlichkeit", "Pattern languages", "Narrow AI", "Flow states", "Vertical compactness",
];
