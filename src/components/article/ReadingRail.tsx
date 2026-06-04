import { Bookmark, Share2, Volume2, Pause, Maximize2, Minimize2, Type } from "lucide-react";
import { ReadingPreferences } from "./ReadingPreferences";

type ListenState = "idle" | "playing" | "paused";

type Props = {
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  shareLabel: string;
  listenSupported: boolean;
  listenState: ListenState;
  onToggleListen: () => void;
  focusMode: boolean;
  onToggleFocus: () => void;
  progress: number;
  minutesLeft: number;
};

function RailButton({
  onClick,
  label,
  active,
  children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex cursor-pointer flex-col items-center gap-2 transition-colors hover:text-foreground ${
        active ? "text-gold" : "text-muted-foreground"
      }`}
    >
      {children}
      <span className="font-mono text-[9px] uppercase tracking-[0.22em]">{label}</span>
    </button>
  );
}

/** Sticky desktop side rail: save / share / listen / focus, plus live progress + time left. */
export function ReadingRail({
  bookmarked,
  onToggleBookmark,
  onShare,
  shareLabel,
  listenSupported,
  listenState,
  onToggleListen,
  focusMode,
  onToggleFocus,
  progress,
  minutesLeft,
}: Props) {
  return (
    <aside
      data-reading-chrome
      className="hidden lg:flex lg:sticky lg:top-32 lg:h-fit lg:flex-col lg:items-end lg:gap-6 lg:pr-8"
    >
      <RailButton
        onClick={onToggleBookmark}
        label={bookmarked ? "Saved" : "Save"}
        active={bookmarked}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </RailButton>

      <RailButton onClick={onShare} label={shareLabel}>
        <Share2 className="h-4 w-4" />
      </RailButton>

      {listenSupported && (
        <RailButton
          onClick={onToggleListen}
          label={
            listenState === "playing" ? "Pause" : listenState === "paused" ? "Resume" : "Listen"
          }
          active={listenState !== "idle"}
        >
          {listenState === "playing" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </RailButton>
      )}

      <div data-focus-toggle>
        <RailButton onClick={onToggleFocus} label="Focus" active={focusMode}>
          {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </RailButton>

        <ReadingPreferences
          trigger={
            <button
              type="button"
              className="group flex flex-col items-center gap-2 pt-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Type className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]">Type</span>
            </button>
          }
        />
      </div>

      <div className="mt-2 flex flex-col items-end gap-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>{Math.round(progress)}%</span>
        <span>{minutesLeft > 0 ? `${minutesLeft} min left` : "Done"}</span>
      </div>
    </aside>
  );
}
