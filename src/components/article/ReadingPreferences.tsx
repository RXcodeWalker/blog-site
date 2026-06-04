import { useTheme } from "@/contexts/ThemeContext";
import {
  useReadingPreferences,
  type ReadingFont,
  type ReadingSize,
  type ReadingLineHeight,
} from "@/contexts/ReadingPreferencesContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Coffee, Type, AlignJustify, AlignLeft, AlignCenter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  trigger: React.ReactNode;
};

export function ReadingPreferences({ trigger }: Props) {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { font, size, lineHeight, setFont, setSize, setLineHeight } = useReadingPreferences();

  const content = (
    <div className="grid gap-6 p-4">
      {/* Theme */}
      <div className="grid gap-3">
        <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Theme
        </Label>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(v) => v && setTheme(v as any)}
          className="justify-start gap-2"
        >
          <ToggleGroupItem value="light" className="flex-1 gap-2" aria-label="Light">
            <Sun className="h-4 w-4" /> Light
          </ToggleGroupItem>
          <ToggleGroupItem value="sepia" className="flex-1 gap-2" aria-label="Sepia">
            <Coffee className="h-4 w-4" /> Sepia
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="flex-1 gap-2" aria-label="Dark">
            <Moon className="h-4 w-4" /> Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Font Family */}
      <div className="grid gap-3">
        <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Typography
        </Label>
        <ToggleGroup
          type="single"
          value={font}
          onValueChange={(v) => v && setFont(v as ReadingFont)}
          className="justify-start gap-2"
        >
          <ToggleGroupItem value="serif" className="flex-1 font-serif" aria-label="Serif">
            Serif
          </ToggleGroupItem>
          <ToggleGroupItem value="sans" className="flex-1 font-sans" aria-label="Sans">
            Sans
          </ToggleGroupItem>
          <ToggleGroupItem value="dyslexic" className="flex-1" aria-label="OpenDyslexic">
            Dyslexic
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Font Size */}
        <div className="grid gap-3">
          <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Size
          </Label>
          <ToggleGroup
            type="single"
            value={size}
            onValueChange={(v) => v && setSize(v as ReadingSize)}
            className="justify-start gap-2"
          >
            <ToggleGroupItem value="sm" className="h-8 w-8 text-xs" aria-label="Small">
              A
            </ToggleGroupItem>
            <ToggleGroupItem value="base" className="h-8 w-8 text-sm" aria-label="Base">
              A
            </ToggleGroupItem>
            <ToggleGroupItem value="lg" className="h-8 w-8 text-base" aria-label="Large">
              A
            </ToggleGroupItem>
            <ToggleGroupItem value="xl" className="h-8 w-8 text-lg" aria-label="Extra Large">
              A
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Line Height */}
        <div className="grid gap-3">
          <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Spacing
          </Label>
          <ToggleGroup
            type="single"
            value={lineHeight}
            onValueChange={(v) => v && setLineHeight(v as ReadingLineHeight)}
            className="justify-start gap-2"
          >
            <ToggleGroupItem value="tight" className="h-8 w-8" aria-label="Tight">
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="base" className="h-8 w-8" aria-label="Standard">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="relaxed" className="h-8 w-8" aria-label="Relaxed">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-serif text-xl font-light">Reading Preferences</DrawerTitle>
          </DrawerHeader>
          {content}
          <div className="h-8" />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 glass-strong border-border shadow-editorial">
        {content}
      </PopoverContent>
    </Popover>
  );
}
