/**
 * Custom MDX component mappings.
 * Each element maps to a styled React component that matches the publication design system.
 */
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/share";
import { CodeBlock } from "@/components/article/CodeBlock";
import { ImageLightbox } from "@/components/article/ImageLightbox";

type AnchorProps = ComponentPropsWithoutRef<"a">;

/** A heading that reveals a click-to-copy permalink anchor on hover. */
function AnchoredHeading({
  as: Tag,
  id,
  className,
  children,
  ...rest
}: { as: "h2" | "h3"; id?: string } & ComponentPropsWithoutRef<"h2">) {
  const copyLink = async () => {
    if (!id) return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    history.replaceState(null, "", `#${id}`);
    try {
      await copyToClipboard(url);
      toast.success("Section link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };
  return (
    <Tag id={id} className={`group scroll-mt-28 ${className ?? ""}`} {...rest}>
      {children}
      {id && (
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link to this section"
          className="ml-2 inline-flex translate-y-[-2px] align-middle text-muted-foreground opacity-0 transition-opacity hover:text-gold group-hover:opacity-100 focus-visible:opacity-100"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      )}
    </Tag>
  );
}

function MdxLink({ href = "", children, ...rest }: AnchorProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link to={href} {...(rest as object)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxBlockquote({ children, ...rest }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="my-8 border-l-2 border-gold pl-6 font-serif text-xl italic leading-relaxed text-muted-foreground"
      {...rest}
    >
      {children}
    </blockquote>
  );
}

function MdxCode({ children, ...rest }: ComponentPropsWithoutRef<"code">) {
  // rehype-pretty-code stamps `data-language` on fenced (block) code — leave those untouched so
  // Shiki's token colours show through. Only inline code gets the gold pill treatment.
  const isBlock = "data-language" in rest;
  if (isBlock) {
    return <code {...rest}>{children}</code>;
  }
  return (
    <code
      className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-gold"
      {...rest}
    >
      {children}
    </code>
  );
}

function MdxH2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  return (
    <AnchoredHeading
      as="h2"
      className="mt-14 mb-4 font-serif text-3xl font-light leading-tight tracking-tight"
      {...rest}
    >
      {children}
    </AnchoredHeading>
  );
}

function MdxH3({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
  return (
    <AnchoredHeading
      as="h3"
      className="mt-10 mb-3 font-serif text-2xl font-light leading-tight tracking-tight"
      {...rest}
    >
      {children}
    </AnchoredHeading>
  );
}

function MdxH4({ children, ...rest }: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className="mt-8 mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
      {...rest}
    >
      {children}
    </h4>
  );
}

function MdxHr() {
  return <hr className="my-12 border-border" />;
}

function MdxUl({ children, ...rest }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className="my-6 space-y-2 pl-6 list-disc marker:text-gold" {...rest}>
      {children}
    </ul>
  );
}

function MdxOl({ children, ...rest }: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className="my-6 space-y-2 pl-6 list-decimal marker:text-gold" {...rest}>
      {children}
    </ol>
  );
}

/**
 * Pass this to MDXProvider's `components` prop or to the compiled MDX component
 * via the `components` prop to apply publication styles globally.
 */
export const mdxComponents = {
  a: MdxLink,
  img: ImageLightbox,
  blockquote: MdxBlockquote,
  pre: CodeBlock,
  code: MdxCode,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  hr: MdxHr,
  ul: MdxUl,
  ol: MdxOl,
} as const;
