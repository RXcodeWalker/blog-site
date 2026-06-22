import { useState } from "react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/newsletter";

type Source = "article" | "footer" | "newsletter_page";
type Status = "idle" | "loading" | "success" | "error";

export function useNewsletterSubscription(source: Source) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === "loading") return;
    setStatus("loading");
    try {
      const result = await subscribeNewsletter({ data: { email: trimmed, source } });
      if (result.ok) {
        track("newsletter_signup", { source });
        setStatus("success");
        setEmail("");
        toast.success("Check your inbox — click the link to confirm.");
      } else if (result.alreadySubscribed) {
        setStatus("idle");
        toast("You're already on the list.", {
          description: "Check your inbox if you haven't confirmed yet.",
        });
      } else {
        setStatus("error");
        toast.error(result.error ?? "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      toast.error("Network error. Please try again.");
    }
  };

  return { email, setEmail, status, handleSubmit };
}
