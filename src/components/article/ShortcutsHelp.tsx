import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SHORTCUTS: [string, string][] = [
  ["J", "Scroll down"],
  ["K", "Scroll up"],
  ["T", "Toggle contents"],
  ["B", "Save / unsave"],
  ["F", "Focus mode"],
  ["?", "This help"],
];

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

/** Keyboard-shortcuts cheat sheet, opened with `?` on the article view. */
export function ShortcutsHelp({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light">Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <ul className="mt-2 flex flex-col gap-2">
          {SHORTCUTS.map(([key, label]) => (
            <li key={key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <kbd className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-xs">
                {key}
              </kbd>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
