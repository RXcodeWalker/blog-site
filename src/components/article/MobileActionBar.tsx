import { Bookmark, Share2, Volume2, Pause, List } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TableOfContents } from "./TableOfContents";
import type { TocHeading } from "@/content/types";

type ListenState = "idle" | "playing" | "paused";

type Props = {
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  listenSupported: boolean;
  listenState: ListenState;
  onToggleListen: () => void;
  progress: number;
  headings: TocHeading[];
  activeHeadingId: string | null;
};

/** Fixed bottom action bar for mobile (the desktop side rail is hidden below `lg`). */
export function MobileActionBar({
  bookmarked,
  onToggleBookmark,
  onShare,
  listenSupported,
  listenState,
  onToggleListen,
  progress,
  headings,
  activeHeadingId,
}: Props) {
  const hasToc = headings.length >= 2;

  return (
    <div
      data-reading-chrome
      className="glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-border lg:hidden"
    >
      {/* progress sliver */}
      <div className="h-px w-full bg-transparent">
        <div
          className="h-px bg-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-2xl items-center justify-around px-6 py-3">
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Save"}
          className={`flex flex-col items-center gap-1 ${bookmarked ? "text-gold" : "text-muted-foreground"}`}
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
        </button>

        <button
          type="button"
          onClick={onShare}
          aria-label="Share"
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {listenSupported && (
          <button
            type="button"
            onClick={onToggleListen}
            aria-label={listenState === "playing" ? "Pause" : "Listen"}
            className={`flex flex-col items-center gap-1 ${listenState !== "idle" ? "text-gold" : "text-muted-foreground"}`}
          >
            {listenState === "playing" ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
        )}

        {hasToc && (
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label="Table of contents"
                className="flex flex-col items-center gap-1 text-muted-foreground"
              >
                <List className="h-5 w-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="font-serif text-xl font-light">On this page</DrawerTitle>
              </DrawerHeader>
              <div className="max-h-[60vh] overflow-y-auto px-4 pb-8">
                <DrawerClose asChild>
                  <div>
                    <TableOfContents headings={headings} activeId={activeHeadingId} />
                  </div>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
