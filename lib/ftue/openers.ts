import type { FtuePracticeMode } from "@/lib/ftue/types";

const NATURAL_OPEN = `Let's try something simple 👇

How would you say this in Japanese?

'I'm a little late, sorry.'`;

const DAILY_OPEN = `Let's try a quick daily moment 👇

How would you say this in Japanese?

'I'm a little late, sorry.'

(You can imagine you're texting a friend before you arrive.)`;

const FREE_OPEN = `Say anything in Japanese — I'll help you sound natural. 👇`;

export function getFtueOpening(mode: Exclude<FtuePracticeMode, "free">): string {
  return mode === "daily" ? DAILY_OPEN : NATURAL_OPEN;
}

export function getFtueFreeOpening(): string {
  return FREE_OPEN;
}

export function ftueEnglishPromptForMode(mode: Exclude<FtuePracticeMode, "free">): string {
  return mode === "daily"
    ? "I'm a little late, sorry. (casual message to a friend before arriving)"
    : "I'm a little late, sorry.";
}
