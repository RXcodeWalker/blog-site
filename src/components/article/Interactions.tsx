import { useEffect, useState } from "react";
import { Heart, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import {
  getInteractions,
  addLike,
  addComment,
  type Comment,
  type Interactions as InteractionsData,
} from "@/lib/interactions";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

interface Props {
  slug: string;
  initialInteractions?: InteractionsData;
}

export function Interactions({ slug, initialInteractions }: Props) {
  const [likes, setLikes] = useState(initialInteractions?.likes ?? 0);
  const [comments, setComments] = useState<Comment[]>(initialInteractions?.comments ?? []);
  const [isLoading, setIsLoading] = useState(!initialInteractions);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // Track if the user has liked this post locally
  const [hasLiked, setHasLiked] = useLocalStorageState(`btb:liked:${slug}`, false);

  // Form state
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    // Only fetch if we don't have initialInteractions (client-side nav or SSR fallback)
    if (initialInteractions) return;

    async function load() {
      try {
        const data = await getInteractions({ data: slug });
        setLikes(data.likes);
        setComments(data.comments);
      } catch (err) {
        console.error("Failed to load interactions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug, initialInteractions]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);
    try {
      const newCount = await addLike({ data: slug });
      setLikes(newCount);
      setHasLiked(true);
      toast.success("Thanks for the support!");
    } catch (err) {
      toast.error("Couldn't add like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const res = await addComment({
        data: { slug, name, text, honeypot },
      });

      if (res.success && res.comment) {
        setComments((prev) => [res.comment!, ...prev]);
        setText("");
        setName("");
        toast.success("Comment posted!");
      } else {
        toast.error(res.error || "Failed to post comment.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-24 max-w-2xl px-6 animate-pulse">
        <div className="h-10 w-32 bg-secondary rounded mb-8" />
        <div className="h-40 bg-secondary rounded" />
      </div>
    );
  }

  return (
    <section className="mx-auto mt-24 max-w-2xl px-6 pb-20">
      <div className="flex items-center justify-between border-y border-border py-8">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            disabled={hasLiked || isLiking}
            className={`group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-all ${
              hasLiked ? "text-gold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                hasLiked ? "fill-gold text-gold" : ""
              }`}
            />
            <span>
              {likes} {likes === 1 ? "Like" : "Likes"}
            </span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span>
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          — Join the conversation
        </div>
      </div>

      <div className="mt-12">
        <form onSubmit={handleComment} className="space-y-4">
          {/* Honeypot field (hidden from users) */}
          <div className="sr-only">
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-foreground/40"
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              required
              placeholder="What are your thoughts?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full rounded border border-border bg-background p-4 text-sm outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCommenting || !text.trim()}
              className="flex items-center gap-2 rounded bg-primary px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isCommenting ? "Posting..." : "Post Comment"}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16 space-y-10">
        {comments.map((comment) => (
          <div key={comment.id} className="group relative">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                {comment.name}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
              {comment.text}
            </p>
          </div>
        ))}

        {comments.length === 0 && !isLoading && (
          <div className="text-center py-12 rounded border border-dashed border-border">
            <p className="font-serif italic text-muted-foreground">
              No comments yet. Be the first to share your thoughts.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
