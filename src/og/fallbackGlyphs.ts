const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

export function sanitizeForSatori(text: string): string {
  return text.replace(EMOJI_RE, "").trim();
}

export function breakLongWords(text: string, maxLen = 20): string {
  return text
    .split(" ")
    .map((word) => {
      if (word.length <= maxLen) return word;
      const parts: string[] = [];
      for (let i = 0; i < word.length; i += maxLen) {
        parts.push(word.slice(i, i + maxLen));
      }
      return parts.join("​");
    })
    .join(" ");
}

export function prepareText(text: string, maxLen?: number): string {
  let out = sanitizeForSatori(text);
  out = breakLongWords(out);
  if (maxLen && out.length > maxLen) {
    out = out.slice(0, maxLen).trimEnd() + "…";
  }
  return out;
}
