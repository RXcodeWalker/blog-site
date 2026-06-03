import { useState, type ComponentPropsWithoutRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * Article image that opens a full-size, zoomable view in a dialog when clicked.
 * Preserves the original figure/figcaption treatment (alt text becomes the caption).
 */
export function ImageLightbox({ src, alt, ...rest }: ComponentPropsWithoutRef<"img">) {
  const [open, setOpen] = useState(false);

  return (
    <figure className="my-10">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="block w-full cursor-zoom-in overflow-hidden rounded"
            aria-label={alt ? `Expand image: ${alt}` : "Expand image"}
          >
            <img
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              className="w-full rounded object-cover transition-transform duration-700 hover:scale-[1.02]"
              {...rest}
            />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-5xl">
          <DialogTitle className="sr-only">{alt || "Image"}</DialogTitle>
          <img src={src} alt={alt ?? ""} className="max-h-[90vh] w-full rounded object-contain" />
        </DialogContent>
      </Dialog>
      {alt && (
        <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
