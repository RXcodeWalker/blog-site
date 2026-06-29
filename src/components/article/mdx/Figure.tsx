import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  attribution?: string;
  fullBleed?: boolean;
  lightbox?: boolean;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  id?: string;
}

export function Figure({
  src,
  alt,
  caption,
  attribution,
  fullBleed = false,
  lightbox = true,
  srcSet,
  sizes,
  width,
  height,
  id,
}: FigureProps) {
  const [open, setOpen] = useState(false);

  const img = (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      className="w-full rounded object-cover transition-transform duration-700 hover:scale-[1.01]"
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <figure
      id={id}
      className={cn("my-10", fullBleed && "mdx-figure-fullbleed")}
    >
      {lightbox ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="block w-full cursor-zoom-in overflow-hidden rounded"
              aria-label={`Expand image: ${alt}`}
            >
              {img}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-5xl">
            <DialogTitle className="sr-only">{alt}</DialogTitle>
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] w-full rounded object-contain"
            />
          </DialogContent>
        </Dialog>
      ) : (
        img
      )}
      {(caption || attribution) && (
        <figcaption className="mt-3 space-y-1">
          {caption && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {caption}
            </p>
          )}
          {attribution && (
            <small className="block font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
              {attribution}
            </small>
          )}
        </figcaption>
      )}
    </figure>
  );
}
