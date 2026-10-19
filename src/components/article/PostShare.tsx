import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard, shareOrCopy } from "@/lib/share";

interface PostShareProps {
  title: string;
  excerpt: string;
}

export function PostShare({ title, excerpt }: PostShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await copyToClipboard(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleShare = async () => {
    const outcome = await shareOrCopy({
      title,
      text: excerpt,
      url: window.location.href,
    });
    if (outcome === "copied") {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } else if (outcome === "error") {
      toast.error("Couldn't share — please copy the URL manually");
    }
  };

  return (
    <section className="mx-auto mt-16 max-w-2xl px-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-electric">
            Share this post
          </div>
          <h3 className="mt-1 font-serif text-lg font-light text-foreground">
            Enjoyed reading? Share it with others
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-all hover:border-gold hover:text-gold"
            aria-label="Copy link to this post"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-gold" />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" />
                <span>Copy link to this post</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Share this post"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </section>
  );
}
