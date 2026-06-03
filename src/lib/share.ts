/** Result of a share/copy attempt, so callers can show the right confirmation. */
export type ShareOutcome = "shared" | "copied" | "error";

/** Copy text to the clipboard, with a hidden-textarea fallback for older browsers. */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  try {
    textarea.select();
    if (!document.execCommand("copy")) throw new Error("Copy command was rejected");
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Share via the Web Share API when available, otherwise copy the URL to the clipboard.
 * Returns what actually happened so the UI can confirm ("Shared" / "Copied" / "Error").
 * A user-cancelled native share resolves to "shared" (treated as a no-op success).
 */
export async function shareOrCopy(data: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareOutcome> {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return "shared";
    }
    await copyToClipboard(data.url);
    return "copied";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "shared";
    try {
      await copyToClipboard(data.url);
      return "copied";
    } catch {
      return "error";
    }
  }
}
