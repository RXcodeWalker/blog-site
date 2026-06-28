import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: 300 | 400 | 600;
  style: "normal" | "italic";
}

let cached: SatoriFont[] | null = null;

export function loadFonts(): SatoriFont[] {
  if (cached) return cached;

  const dir = resolve(process.cwd(), "public/fonts");
  const read = (file: string): ArrayBuffer => {
    const buf = readFileSync(resolve(dir, file));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  };

  cached = [
    { name: "Fraunces", data: read("Fraunces-Light.woff"), weight: 300, style: "normal" },
    { name: "Fraunces", data: read("Fraunces-Regular.woff"), weight: 400, style: "normal" },
    { name: "Fraunces", data: read("Fraunces-RegularItalic.woff"), weight: 400, style: "italic" },
    { name: "Inter", data: read("Inter-Regular.woff"), weight: 400, style: "normal" },
    { name: "Inter", data: read("Inter-SemiBold.woff"), weight: 600, style: "normal" },
  ];

  return cached;
}
