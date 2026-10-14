import { cn } from "@/lib/utils";
import { categoryCssVars, getCategoryStyle } from "@/lib/categoryStyle";
import { CATEGORIES } from "@/content/taxonomy/categories";
import type { CategorySlug } from "@/content/types";

interface CategoryBadgeProps {
  slug: CategorySlug | string;
  className?: string;
  size?: "sm" | "md";
}

export function CategoryBadge({ slug, className, size = "sm" }: CategoryBadgeProps) {
  const style = getCategoryStyle(slug);
  const name =
    slug in CATEGORIES ? CATEGORIES[slug as CategorySlug].name : slug;

  return (
    <span
      style={categoryCssVars(slug)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 font-mono uppercase tracking-[0.18em] text-[var(--cat)] backdrop-blur-md",
        size === "sm" ? "px-2.5 py-1 text-[9px]" : "px-3 py-1.5 text-[10px]",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--cat)] shadow-[0_0_8px_var(--cat)]" />
      {name}
      <style.icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
    </span>
  );
}
